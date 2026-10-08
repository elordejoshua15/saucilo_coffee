<?php

require_once "db.php"; // header + error handling are now set up inside db.php

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";


// Check fields
if (empty($email) || empty($password)) {

    echo json_encode([
        "success" => false,
        "message" => "Please enter your email and password."
    ]);

    exit;
}


// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid email address."
    ]);

    exit;
}


try {

    // Find user
    $stmt = $conn->prepare("
        SELECT
            id,
            name,
            email,
            password,
            role
        FROM users
        WHERE email = ?
        LIMIT 1
    ");

    $stmt->execute([$email]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);


    // User not found
    if (!$user) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password."
        ]);

        exit;
    }


    // Verify password
    if (!password_verify($password, $user["password"])) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password."
        ]);

        exit;
    }


    // Login successful
    echo json_encode([
        "success" => true,
        "message" => "Login successful!",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"]
        ]
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Login failed: " . $e->getMessage()
    ]);

}

?>