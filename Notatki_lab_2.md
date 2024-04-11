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