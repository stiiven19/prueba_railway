from rest_framework.test import APITestCase
from django.urls import reverse
from usuarios.models import Usuario
from empleos.models import OfertaLaboral

class FiltroBusquedaTest(APITestCase):

    def setUp(self):
        self.user = Usuario.objects.create_user(username="admin", email="admin@test.com", password="admin123")
        self.client.force_authenticate(user=self.user)
        OfertaLaboral.objects.create(titulo="React Dev", descripcion="Frontend", salario=4000000, ubicacion="Remoto")
        OfertaLaboral.objects.create(titulo="Django Dev", descripcion="Backend", salario=5000000, ubicacion="Bogotá")

    def test_filtrar_por_ubicacion(self):
        url = reverse("ofertalaboral-list") + "?ubicacion=Remoto"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(all(oferta["ubicacion"] == "Remoto" for oferta in response.data))

    def test_busqueda_por_titulo(self):
        url = reverse("ofertalaboral-list") + "?search=Django"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any("Django" in oferta["titulo"] for oferta in response.data))
