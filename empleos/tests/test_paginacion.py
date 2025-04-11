from rest_framework.test import APITestCase
from django.urls import reverse
from usuarios.models import Usuario
from empleos.models import Vacante

class PaginacionTest(APITestCase):

    def setUp(self):
        self.user = Usuario.objects.create_user(username="admin", email="admin@test.com", password="admin123")
        self.client.force_authenticate(user=self.user)

        for i in range(15):
            Vacante.objects.create(
                reclutador=self.user,
                titulo=f"Cargo {i}",
                descripcion="Descripción genérica",
                requisitos="Requisitos básicos",
                ubicacion="Remoto",
                tipo_contrato="Freelance"
            )

    def test_paginacion_por_default(self):
        url = reverse("vacante-list")  # Asegúrate que este nombre coincide con tu router
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("results", response.data)
        self.assertLessEqual(len(response.data["results"]), 10)  # Suponiendo que el paginado por defecto es 10
