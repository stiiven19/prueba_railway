from django.test import TestCase
from postulaciones.models import Postulacion
from usuarios.models import Usuario
from empleos.models import OfertaLaboral

class PostulacionModelTest(TestCase):

    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            username="juan123", email="juan@correo.com", password="pass1234"
        )
        self.oferta = OfertaLaboral.objects.create(
            titulo="DevOps", descripcion="Experiencia con Docker", salario=6000000, ubicacion="Medellín"
        )

    def test_postulacion_valida(self):
        postulacion = Postulacion.objects.create(
            usuario=self.usuario,
            oferta=self.oferta,
            estado="pendiente"
        )
        self.assertEqual(postulacion.estado, "pendiente")

    def test_postulacion_sin_oferta_invalida(self):
        with self.assertRaises(ValueError):
            Postulacion.objects.create(
                usuario=self.usuario,
                oferta=None,
                estado="pendiente"
            )
