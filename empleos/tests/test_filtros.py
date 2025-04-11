from django.test import TestCase
from empleos.models import Vacante
from django.contrib.auth import get_user_model

User = get_user_model()

class VacanteFiltroTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='admin', password='pass')

        Vacante.objects.create(
            reclutador=self.user,
            titulo="Dev Junior",
            descripcion="Desarrollador nivel junior",
            requisitos="Python, Git",
            ubicacion="Bogotá",
            tipo_contrato="Tiempo completo"
        )

        Vacante.objects.create(
            reclutador=self.user,
            titulo="Dev Senior",
            descripcion="Desarrollador senior",
            requisitos="Django, REST",
            ubicacion="Medellín",
            tipo_contrato="Freelance"
        )

    def test_filtrar_por_ubicacion(self):
        vacantes_bogota = Vacante.objects.filter(ubicacion="Bogotá")
        self.assertEqual(vacantes_bogota.count(), 1)
        self.assertEqual(vacantes_bogota.first().titulo, "Dev Junior")

    def test_filtrar_por_tipo_contrato(self):
        vacantes_freelance = Vacante.objects.filter(tipo_contrato="Freelance")
        self.assertEqual(vacantes_freelance.count(), 1)
        self.assertEqual(vacantes_freelance.first().titulo, "Dev Senior")
