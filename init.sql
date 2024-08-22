CREATE TABLE Contacts (
    Id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    Name TEXT NOT NULL,
    Phone VARCHAR(12) NOT NULL,
    Responded BOOLEAN NOT NULL,
    Attending BOOLEAN NOT NULL,
    Number INT
);

INSERT INTO Contacts (Name, Phone, Responded, Attending, Number) 
VALUES ('Lydia Hillary', '+13137275279', 'f', 'f', 0);