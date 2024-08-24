CREATE TABLE Contacts (
    Id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    Name TEXT NOT NULL,
    Phone VARCHAR(12) NOT NULL,
    Responded BOOLEAN NOT NULL,
    Attending BOOLEAN NOT NULL,
    Number INT
);

INSERT INTO Contacts (Name, Phone, Responded, Attending, Number) 
VALUES ('Keith Schramm', '+19897517805', 'f', 'f', 0);