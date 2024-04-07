from datetime import timedelta
from django.core.mail import send_mail, EmailMessage
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Contact, UserProfile
from .serializers import LoginSerializer, RegistrationSerializer, AddContactSerializer, GetContactsSerializer, \
    UserDetailsSerializer, EditUserSerializer, EmailContactsSerializer
from django.contrib.auth import authenticate, login, logout
from .forms import LoginForm, RegistrationForm
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class login_view(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                request, username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)

                if user.is_superuser:
                    refresh.access_token.set_exp(
                        lifetime=timedelta(minutes=60))

                response_data = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class register_view(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            if User.objects.filter(email=email).exists():
                return Response({'detail': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=serializer.validated_data['username']).exists():
                return Response({'detail': 'Username taken'}, status=status.HTTP_400_BAD_REQUEST)

            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class logout_view(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)


class AddContactView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddContactSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Contact added successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteContactView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, contact_id):
        try:
            # Assuming Contact model has a field named 'id' for contact identification
            contact = Contact.objects.get(
                contact_user=contact_id, user=request.user)
            contact.delete()
            return Response({'detail': 'Contact deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Contact.DoesNotExist:
            return Response({'detail': 'Contact not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetContactsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        contacts = Contact.objects.filter(user=user)
        serializer = GetContactsSerializer(contacts, many=True)
        return Response({'contacts': serializer.data}, status=status.HTTP_200_OK)


class GetUserDetailsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(request.headers)  # Print headers for debugging
        user_serializer = UserDetailsSerializer(request.user)
        return Response(user_serializer.data, status=status.HTTP_200_OK)


class GetDetailsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, uid):
        print(request.headers)  # Print headers for debugging
        user_serializer = UserDetailsSerializer(
            User.objects.filter(id=uid).first())
        return Response(user_serializer.data, status=status.HTTP_200_OK)


class EditUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = EditUserSerializer(
            request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailContactsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = EmailContactsSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            subject = serializer.validated_data['subject']
            body = serializer.validated_data['body']
            contacts = serializer.validated_data['contacts']

            user = request.user
            user_email = user.email

            try:
                for contact_id in contacts:
                    contact = User.objects.get(pk=contact_id)
                    print(contact)
                    contact_email = contact.email
                    print(contact_email)

                    if contact_email:
                        send_mail(subject, body, user_email, [contact_email])
                        pass
                    else:
                        return Response({'detail': f"Contact with ID {contact_id} does not exist or does not belong to the authenticated user."},
                                        status=status.HTTP_404_NOT_FOUND)

            except Exception as e:
                return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'message': 'Emails sent successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
