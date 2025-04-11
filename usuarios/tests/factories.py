import factory
from usuarios.models import Usuario

class UsuarioFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Usuario

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@test.com")
    password = factory.PostGenerationMethodCall('set_password', 'password123')
    rol = 'candidato'
