from rest_framework.exceptions import PermissionDenied
from django.urls import reverse
from empleos.models import Vacante
from usuarios.models import Usuario
from rest_framework.test import APITestCase


class VacanteViewSetTest(APITestCase):


    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated or not getattr(user, 'es_reclutador', False):
            raise PermissionDenied("Solo los reclutadores pueden crear vacantes.")
        serializer.save(usuario=user)


    def setUp(self):
        self.user = Usuario.objects.create_user(username="admin", email="admin@test.com", password="admin123", es_reclutador=True)
        self.client.force_authenticate(user=self.user)
        self.vacante = Vacante.objects.create(
            reclutador=self.user,
            titulo="Data Scientist",
            descripcion="Python y ML",
            requisitos="Experiencia con pandas y scikit-learn",
            ubicacion="Medellín",
            tipo_contrato="Tiempo completo"
        )

    def test_lista_vacantes(self):
        url = reverse("vacante-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_crear_vacante_valida(self):
        url = reverse("vacante-list")
        data = {
            "titulo": "Diseñador UI/UX",
            "descripcion": "Portfolio requerido",
            "requisitos": "Figma, Adobe XD",
            "ubicacion": "Remoto",
            "tipo_contrato": "Freelance"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_crear_vacante_invalida(self):
        url = reverse("vacante-list")
        data = {
            "descripcion": "Sin título",
            "requisitos": "Algo",
            "ubicacion": "Cali",
            "tipo_contrato": "Temporal"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("titulo", response.data)

    def test_eliminar_vacante(self):
        url = reverse("vacante-detail", args=[self.vacante.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
