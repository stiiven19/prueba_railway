from django.test import TestCase
from empleos.models import Vacante
from django.contrib.auth import get_user_model

User = get_user_model()

class VacanteModelTest(TestCase):
    def setUp(self):
        self.reclutador = User.objects.create_user(
            username='reclutador1',
            email='reclutador1@example.com',
            password='testpass123'
        )

    def test_crear_vacante(self):
        vacante = Vacante.objects.create(
            reclutador=self.reclutador,
            titulo='Desarrollador Backend',
            descripcion='Desarrollo de APIs REST',
            requisitos='Experiencia en Django',
            ubicacion='Bogotá',
            tipo_contrato='Tiempo completo'
        )
        self.assertEqual(vacante.titulo, 'Desarrollador Backend')
        self.assertEqual(vacante.reclutador.username, 'reclutador1')
