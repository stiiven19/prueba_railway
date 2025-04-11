from django.test import TestCase
from .models import Usuario, PerfilCandidato, PerfilReclutador
from .serializers import RegistroUsuarioSerializer

class RegistroUsuarioSerializerTest(TestCase):
    def test_registro_candidato_exitoso(self):
        data = {
            'username': 'candidato1',
            'email': 'candidato@example.com',
            'password': 'seguro123',
            'first_name': 'Juan',
            'last_name': 'Pérez',
            'rol': 'candidato',
            'perfil_candidato': {
                'telefono': '123456789',
                'cv': 'http://example.com/cv.pdf'
            }
        }
        serializer = RegistroUsuarioSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        usuario = serializer.save()

        self.assertEqual(usuario.username, 'candidato1')
        self.assertTrue(usuario.check_password('seguro123'))
        self.assertEqual(usuario.rol, 'candidato')
        self.assertTrue(PerfilCandidato.objects.filter(user=usuario).exists())

    def test_registro_reclutador_exitoso(self):
        data = {
            'username': 'reclutador1',
            'email': 'reclutador@example.com',
            'password': 'seguro123',
            'first_name': 'Ana',
            'last_name': 'López',
            'rol': 'reclutador',
            'perfil_reclutador': {
                'empresa': 'TechCorp',
                'telefono': '987654321'
            }
        }
        serializer = RegistroUsuarioSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        usuario = serializer.save()

        self.assertEqual(usuario.username, 'reclutador1')
        self.assertEqual(usuario.rol, 'reclutador')
        self.assertTrue(PerfilReclutador.objects.filter(user=usuario).exists())

    def test_error_sin_perfil_candidato(self):
        data = {
            'username': 'candidato2',
            'email': 'c2@example.com',
            'password': 'seguro123',
            'first_name': 'Luis',
            'last_name': 'Martínez',
            'rol': 'candidato'
            # Falta perfil_candidato
        }
        serializer = RegistroUsuarioSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('perfil_candidato', serializer.errors)

    def test_error_sin_perfil_reclutador(self):
        data = {
            'username': 'reclutador2',
            'email': 'r2@example.com',
            'password': 'seguro123',
            'first_name': 'Carla',
            'last_name': 'García',
            'rol': 'reclutador'
            # Falta perfil_reclutador
        }
        serializer = RegistroUsuarioSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('perfil_reclutador', serializer.errors)

    def test_password_se_guarda_encriptado(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'supersegura',
            'first_name': 'Test',
            'last_name': 'User',
            'rol': 'candidato',
            'perfil_candidato': {
                'telefono': '111222333',
                'cv': 'http://example.com/testcv.pdf'
            }
        }
        serializer = RegistroUsuarioSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        usuario = serializer.save()

        self.assertNotEqual(usuario.password, 'supersegura')  # Debe estar hasheada
        self.assertTrue(usuario.check_password('supersegura'))

