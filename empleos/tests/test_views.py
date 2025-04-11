from rest_framework.test import APITestCase
from django.urls import reverse
from empleos.models import OfertaLaboral
from usuarios.models import Usuario

class OfertaLaboralViewSetTest(APITestCase):

    def setUp(self):
        self.user = Usuario.objects.create_user(username="admin", email="admin@test.com", password="admin123")
        self.client.force_authenticate(user=self.user)
        self.oferta = OfertaLaboral.objects.create(
            titulo="Data Scientist",
            descripcion="Python y ML",
            salario=8000000,
            ubicacion="Medellín"
        )

    def test_lista_ofertas(self):
        url = reverse("ofertalaboral-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_crear_oferta_valida(self):
        url = reverse("ofertalaboral-list")
        data = {
            "titulo": "Diseñador UI/UX",
            "descripcion": "Portfolio requerido",
            "salario": 4000000,
            "ubicacion": "Remoto"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_crear_oferta_invalida(self):
        url = reverse("ofertalaboral-list")
        data = {"descripcion": "Sin título", "salario": 2000000, "ubicacion": "Cali"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("titulo", response.data)

    def test_eliminar_oferta(self):
        url = reverse("ofertalaboral-detail", args=[self.oferta.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
