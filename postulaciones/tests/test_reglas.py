from django.test import TestCase
from postulaciones.models import Postulacion
from usuarios.models import Usuario
from empleos.models import OfertaLaboral

class ReglasPostulacionTest(TestCase):

    def setUp(self):
        self.user = Usuario.objects.create_user(username="carlos", email="carlos@correo.com", password="clave")
        self.oferta = OfertaLaboral.objects.create(
            titulo="Data Engineer", descripcion="ETL", salario=7000000, ubicacion="Remoto"
        )

    def test_no_permitir_doble_postulacion(self):
        Postulacion.objects.create(usuario=self.user, oferta=self.oferta, estado="pendiente")
        with self.assertRaises(Exception):
            Postulacion.objects.create(usuario=self.user, oferta=self.oferta, estado="pendiente")
