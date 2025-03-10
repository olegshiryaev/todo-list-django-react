from rest_framework import serializers
from .models import Task, Category
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class TaskSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "user",
            "title",
            "description",
            "completed",
            "created_at",
            "category",
            "category_id",
        ]
        read_only_fields = ["user", "created_at"]
        extra_kwargs = {
            "title": {"required": False},
            "description": {"required": False},
            "completed": {"required": False},
        }

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.completed = validated_data.get("completed", instance.completed)
        # Используем category_id вместо category
        instance.category = validated_data.get(
            "category", instance.category
        )  # 'category' уже содержит объект из category_id
        instance.save()
        return instance
