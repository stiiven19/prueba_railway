from rest_framework.test import APITestCase
from django.urls import reverse
from usuarios.models import Usuario
from empleos.models import OfertaLaboral

class PaginacionTest(APITestCase):

    def setUp(self):
        self.user = Usuario.objects.create_user(username="admin", email="admin@test.com", password="admin123")
        self.client.force_authenticate(user=self.user)
        for i in range(15):
            OfertaLaboral.objects.create(
                titulo=f"Cargo {i}",
                descripcion="Algo",
                salario=1000000 + i * 1000,
                ubicacion="Remoto"
            )

    def test_paginacion_por_default(self):
        url = reverse("ofertalaboral-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("results", response.data)
