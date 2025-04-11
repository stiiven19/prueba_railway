from rest_framework.test import APITestCase
from django.urls import reverse
from usuarios.models import Usuario
from empleos.models import OfertaLaboral

class OfertaLaboralCrudTest(APITestCase):

    def setUp(self):
        self.user = Usuario.objects.create_user(username="admin", email="admin@test.com", password="admin123")
        self.client.force_authenticate(user=self.user)
        self.oferta = OfertaLaboral.objects.create(
            titulo="QA Engineer",
            descripcion="Automatización",
            salario=3000000,
            ubicacion="Cali"
        )

    def test_actualizar_oferta_con_put(self):
        url = reverse("ofertalaboral-detail", args=[self.oferta.id])
        data = {
            "titulo": "QA Senior",
            "descripcion": "Con experiencia",
            "salario": 5000000,
            "ubicacion": "Remoto"
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["titulo"], "QA Senior")

    def test_actualizar_solo_un_campo_con_patch(self):
        url = reverse("ofertalaboral-detail", args=[self.oferta.id])
        response = self.client.patch(url, {"salario": 7000000})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["salario"], 7000000)

    def test_eliminar_oferta(self):
        url = reverse("ofertalaboral-detail", args=[self.oferta.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
