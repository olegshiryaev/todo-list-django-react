from django.urls import path
from .views import TaskListCreateView, TaskUpdateView

urlpatterns = [
    path("tasks/", TaskListCreateView.as_view(), name="task-list-create"),
    path("tasks/<int:pk>/", TaskUpdateView.as_view(), name="task-update"),
]
