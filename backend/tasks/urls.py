from django.urls import path
from .views import (
    TaskListCreateView,
    TaskUpdateView,
    TaskDeleteView,
    CategoryListCreateView,
    RegisterView,
)

urlpatterns = [
    path("tasks/", TaskListCreateView.as_view(), name="task-list-create"),
    path("tasks/<int:pk>/", TaskUpdateView.as_view(), name="task-update"),
    path("tasks/<int:pk>/delete/", TaskDeleteView.as_view(), name="task-delete"),
    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("register/", RegisterView.as_view(), name="register"),
]
