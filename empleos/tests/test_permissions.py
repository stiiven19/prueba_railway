from rest_framework.test import APITestCase
from django.urls import reverse
from empleos.models import OfertaLaboral
from usuarios.models import Usuario

class PermisosTest(APITestCase):

    def setUp(self):
        self.usuario = Usuario.objects.create_user(username="juan", email="juan@test.com", password="clave123")
        self.oferta = OfertaLaboral.objects.create(
            titulo="Backend",
            descripcion="Django requerido",
            salario=5000000,
            ubicacion="Remoto"
        )

    def test_usuario_no_autenticado_no_puede_crear(self):
        url = reverse("ofertalaboral-list")
        data = {
            "titulo": "Nuevo cargo",
            "descripcion": "Sin login",
            "salario": 4000000,
            "ubicacion": "Bogotá"
        }
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [401, 403])  # depende config

    def test_usuario_autenticado_si_puede_crear(self):
        self.client.force_authenticate(user=self.usuario)
        url = reverse("ofertalaboral-list")
        data = {
            "titulo": "Nuevo cargo",
            "descripcion": "Con login",
            "salario": 4000000,
            "ubicacion": "Bogotá"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
