import pytest
from usuarios.models import Usuario

@pytest.mark.django_db
def test_creacion_usuario():
    usuario = Usuario.objects.create_user(username='testuser', password='testpass', rol='candidato')
    assert usuario.username == 'testuser'
    assert usuario.rol == 'candidato'
    assert usuario.check_password('testpass')
