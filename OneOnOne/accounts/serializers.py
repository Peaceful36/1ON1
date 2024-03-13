from django.contrib.auth.models import User
from rest_framework import serializers

from accounts.models import Contact, UserProfile


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class RegistrationSerializer(serializers.Serializer):
    # Add fields needed for registration
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Create a new user with the validated data
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user

class AddContactSerializer(serializers.Serializer):
    contact_id = serializers.IntegerField()

    def validate_contact_id(self, value):
        try:
            User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this ID does not exist.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        contact_id = validated_data['contact_id']

        contact_user = User.objects.get(pk=contact_id)

        if Contact.objects.filter(user=user, contact_user=contact_user).exists():
            raise serializers.ValidationError("Contact already exists.")

        contact = Contact.objects.create(user=user, contact_user=contact_user)
        return contact

class GetContactsSerializer(serializers.ModelSerializer):
    contact_user_username = serializers.ReadOnlyField(source='contact_user.username')
    contact_user_email = serializers.ReadOnlyField(source='contact_user.email')
    class Meta:
        model = Contact
        fields = ['user', 'contact_user', 'contact_user_username', 'contact_user_email']

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']


class EmailContactsSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=200)
    body = serializers.CharField()
    contacts = serializers.ListField(child=serializers.IntegerField())

    def validate_contacts(self, value):
        """
        Validate that each contact ID corresponds to an existing contact.
        """
        user = self.context['request'].user
        user_contact_ids = Contact.objects.filter(user=user).values_list('contact_user_id', flat=True)
        for contact in user_contact_ids:
            print(contact)
        for contact_id in value:
            if contact_id not in user_contact_ids:
                raise serializers.ValidationError(f"Contact with ID {contact_id} does not exist.")
        return value
