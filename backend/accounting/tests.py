from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User


class JournalEndpointTests(APITestCase):
    def setUp(self):
        # Crear usuario para autenticación
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.url = reverse('journal')  # El nombre de la url, si no lo tenés, podés poner la ruta directa '/reports/journal/'

    def test_journal_requires_authentication(self):
        # Probar sin token: debe responder 401 Unauthorized
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_journal_with_authentication(self):
        # Loguearse
        self.client.login(username='testuser', password='testpass')
        # Hacer request autenticado
        response = self.client.get(self.url)
        # Debe ser 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
