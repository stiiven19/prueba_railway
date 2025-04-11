import pytest
from rest_framework.test import APIClient
from usuarios.models import Usuario

@pytest.mark.django_db
def test_registro_usuario():
    client = APIClient()
    data = {
        'username': 'nuevo_usuario',
        'password': 'password_1223',
        'email': 'nuevo@usuario.com',
        'first_name': 'Nuevo',
        'last_name': 'Usuario',
        'rol': 'reclutador',
        'perfil_reclutador': {
            'empresa': 'Empresa Ejemplo',
            'telefono': '123456789',
            'cargo': 'Gerente de RRHH'
        }
    }
    response = client.post('/api/usuarios/registro/', data, format='json')
    print("STATUS:", response.status_code)
    print("DATA:", response.data)
    assert response.status_code == 201
    assert Usuario.objects.filter(username='nuevo_usuario').exists()
