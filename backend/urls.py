from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "API funcionando correctamente"})

urlpatterns = [
    path('', home),  # Ruta raíz
    # otras rutas...
]