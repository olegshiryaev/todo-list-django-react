from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "user", "title", "description", "completed", "created_at"]
        read_only_fields = ["user", "created_at"]
