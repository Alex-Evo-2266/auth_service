from oauthlib.oauth2 import RequestValidator

# From the previous section on models
from auth_service.models import Client

class MyRequestValidator(RequestValidator):

    def validate_client_id(self, client_id, request):
        client = Client.objects.get_or_none(client_id=client_id)
        if client:
            return True
        else:
            return False
