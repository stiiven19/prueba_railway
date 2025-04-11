from rest_framework.test import APITestCase
from django.urls import reverse
from empleos.models import Vacante
from usuarios.models import Usuario

class PermisosTest(APITestCase):

    def setUp(self):
        self.usuario = Usuario.objects.create_user(username="juan", email="juan@test.com", password="clave123")
        self.vacante = Vacante.objects.create(
            reclutador=self.usuario,
            titulo="Backend",
            descripcion="Django requerido",
            requisitos="Experiencia con APIs REST",
            ubicacion="Remoto",
            tipo_contrato="Indefinido"
        )

    def test_usuario_no_autenticado_no_puede_crear(self):
        url = reverse("vacante-list")  # Asegúrate que coincida con tu basename en el router
        data = {
            "titulo": "Nuevo cargo",
            "descripcion": "Sin login",
            "requisitos": "Ninguno",
            "ubicacion": "Bogotá",
            "tipo_contrato": "Temporal",
            "reclutador": self.usuario.id  # puede requerirse explícitamente
        }
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [401, 403])  # depende si usas IsAuthenticated u otra config

    def test_usuario_autenticado_si_puede_crear(self):
        self.client.force_authenticate(user=self.usuario)
        url = reverse("vacante-list")
        data = {
            "titulo": "Nuevo cargo",
            "descripcion": "Con login",
            "requisitos": "Conocimiento de Python",
            "ubicacion": "Bogotá",
            "tipo_contrato": "Tiempo completo"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
