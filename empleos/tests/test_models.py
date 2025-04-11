from django.test import TestCase
from empleos.models import OfertaLaboral

class OfertaLaboralModelTest(TestCase):

    def test_crear_oferta_valida(self):
        oferta = OfertaLaboral.objects.create(
            titulo="Frontend Developer",
            descripcion="Con experiencia en React",
            salario=4500000,
            ubicacion="Remoto"
        )
        self.assertEqual(oferta.titulo, "Frontend Developer")

    def test_salario_negativo_no_valido(self):
        with self.assertRaises(ValueError):
            OfertaLaboral.objects.create(
                titulo="Junior",
                descripcion="Solo prácticas",
                salario=-5000,
                ubicacion="Bogotá"
            )
