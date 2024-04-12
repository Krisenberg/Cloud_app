# Notatki z wykonywania listy 2  

## Stwórz plik main.tf a w nim utwórz podstawową konfigurację do hostowana aplikacji stworzonej podczas poprzedniej listy zadań, konfiguracja powinna zawierać:  
- Konfigurację instancji EC2 opisanej odpowiednimi tagami  
    1. Wybierz odpowiedni obraz AMI, który będzie służył jako podstawa dla instancji EC2.  
        *The AMI resource allows the creation and management of a completely-custom Amazon Machine Image (AMI).*  
        Obraz maszyny Amazon to specjalny typ urządzenia wirtualnego, który służy do tworzenia maszyny wirtualnej w ramach Amazon Elastic Compute Cloud. Służy jako podstawowa jednostka wdrożeniowa dla usług świadczonych za pomocą EC2.  
        
    2. Wybierz typ instancji EC2, który najlepiej pasuje do potrzeb aplikacji.  
    3. Przypisz instancji grupę zabezpieczeń (ang. security group), która umożliwia ruch sieciowy na odpowiednich portach (np. 80 dla HTTP, 443 dla HTTPS, 8080 dla backend).  
- Grupę bezpieczeństwa (ang. security group)  
- Konfigurację sieciową  

## How to Create AWS EC2 Instance Using Terraform
Wymagania:  
[x] konto AWS  
[x] zainstalowany Terraform  
[ ] zainstalowane AWS CLI, użytkownik z uprawnieniami:  
    - uruchomić `aws configure`  
    - pobrać dane z *AWS Details*  
    - podać *AWS access key ID*, *secret access key*, *default region*, *default output format*  
[ ] wygenerowane klucze SSH:  
    1. Uruchomić `ssh-keygen -t rsa -b 4096`  
    2. Podać nazwę pliku, gdzie zostaną zapisane klucze  
    3. Opcjonalnie zabezpieczyć hasłem także parę kluczy  
    4. Dodać klucz publiczny do instancji przy konfigurowaniu Terraforma

Autentykacja AWS - mając AWS CLI możemy używać nazwanych profili, co jest generalnie polecanym sposobem autentykacji
Terraforma z AWS CLI. W tym celu należy stworzyć nazwany profil dla Terraforma w folderze `%UserProfile%\.aws\config`.

