from django.test import TestCase
from usuarios.models import Usuario

class UsuarioModelTest(TestCase):

    def test_creacion_usuario_valido(self):
        usuario = Usuario.objects.create_user(
            username="laura321", email="laura@correo.com", password="seguro123"
        )
        self.assertTrue(usuario.check_password("seguro123"))

    def test_creacion_usuario_sin_email(self):
        with self.assertRaises(ValueError):
            Usuario.objects.create_user(username="mario321", email="", password="clave")
