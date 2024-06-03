# #See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# #Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
# #For more information, please see https://aka.ms/containercompat

# FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
# WORKDIR /app
# EXPOSE 80
# EXPOSE 443

# FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
# WORKDIR /src
# COPY ["CloudStorage.csproj", "."]
# RUN dotnet restore "./CloudStorage.csproj"
# COPY . .
# WORKDIR "/src/."
# RUN dotnet build "CloudStorage.csproj" -c Release -o /app/build

# FROM build AS publish
# RUN dotnet publish "CloudStorage.csproj" -c Release -o /app/publish /p:UseAppHost=false

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "CloudStorage.dll"]

# #See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# #Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
# #For more information, please see https://aka.ms/containercompat

#FROM mcr.microsoft.com/dotnet/runtime:7.0: This section starts a new phase using the runtime image.
#This image is small and contains only the runtime needed to run .NET Core applications,
#unlike the SDK image, which is used for builds
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
#EXPOSE 80
#EXPOSE 443


#Start with the base image, for your Docker container, which is specified as mcr.microsoft.com/dotnet/sdk:7.0.
#This image uses the official.NET Core SDK 7.0, as its starting point.
#To later refer to this stage it is given the alias �build�.

#Next set the working directory within the container to /src.
#This is where your application files will be copied and built.
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
#To copy the project files (*.csproj) from your computer to the /app directory in the container you need to use
#the command �COPY *.csproj./�. This step is separated from the one to optimize Docker�s layer caching.
#It ensures that when there are changes in your project file the subsequent steps will be executed.
COPY ["CloudStorage.csproj", "."]
#To restore the project�s dependencies and make sure that all required packages are downloaded and available,
#for building the application you can use the command �RUN dotnet restore�.
#This command will take care of restoring all dependencies.
RUN dotnet restore "./CloudStorage.csproj"
#Next, Copy the remaining source code and files from the local directory to the app directory
#and build the application
COPY . .
WORKDIR "/src/."
#This command builds the .NET Core Web API Application in Release mode and publishes the output
#to the out directory. The -o out flag specifies the output directory.
RUN dotnet build "CloudStorage.csproj" -c Release -o /app/build

FROM base AS runtime
#WORKDIR /app: Set the working directory as /app in this new section
WORKDIR /app
#Copies the compiled application from the build component to the current runtime component.
#This ensures that only necessary features are added to the final runtime image.
COPY --from=build /app/build ./
#This line specifies that the container will expose port 80
ENV MSSQL_SA_PASSWORD=${MSSQL_SA_PASSWORD}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN}
ENV S3_BUCKET=${S3_BUCKET}
ENV APP_DOMAIN=${APP_DOMAIN}

EXPOSE 80
#Specifies the command to be executed when an object based on this image is started.
#In this case, it creates .NET Core Web API Application by calling the dotnet server.dll
ENTRYPOINT ["dotnet", "CloudStorage.dll"]	