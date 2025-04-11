from rest_framework.test import APITestCase
from django.urls import reverse
from usuarios.models import Usuario
from empleos.models import Vacante

class VacanteCrudTest(APITestCase):

    def setUp(self):
        self.user = Usuario.objects.create_user(username="admin", email="admin@test.com", password="admin123")
        self.client.force_authenticate(user=self.user)
        self.vacante = Vacante.objects.create(
            reclutador=self.user,
            titulo="QA Engineer",
            descripcion="Automatización",
            requisitos="Selenium, Python",
            ubicacion="Cali",
            tipo_contrato="Tiempo completo"
        )

    def test_actualizar_vacante_con_put(self):
        url = reverse("vacante-detail", args=[self.vacante.id])
        data = {
            "reclutador": self.user.id,
            "titulo": "QA Senior",
            "descripcion": "Con experiencia",
            "requisitos": "Postman, Selenium",
            "ubicacion": "Remoto",
            "tipo_contrato": "Medio tiempo"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["titulo"], "QA Senior")

    def test_actualizar_solo_salario_con_patch(self):
        url = reverse("vacante-detail", args=[self.vacante.id])
        response = self.client.patch(url, {"tipo_contrato": "Freelance"}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["tipo_contrato"], "Freelance")

    def test_eliminar_vacante(self):
        url = reverse("vacante-detail", args=[self.vacante.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
