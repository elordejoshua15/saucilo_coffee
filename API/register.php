<?php

require_once "db.php"; // header + error handling are now set up inside db.php


// ==========================================
// GET JSON DATA
// ==========================================

$data = json_decode(
    file_get_contents("php://input"),
    true
);


// ==========================================
// GET VALUES
// ==========================================

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";


// ==========================================
// CHECK EMPTY FIELDS
// ==========================================

if (
    empty($name) ||
    empty($email) ||
    empty($password)
) {

    echo json_encode([
        "success" => false,
        "message" => "Please complete all fields."
    ]);

    exit;
}


// ==========================================
// VALIDATE EMAIL
// ==========================================

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid email address."
    ]);

    exit;
}


// ==========================================
// CHECK PASSWORD LENGTH
// ==========================================

if (strlen($password) < 6) {

    echo json_encode([
        "success" => false,
        "message" => "Password must be at least 6 characters."
    ]);

    exit;
}


try {

    // ======================================
    // CHECK IF EMAIL ALREADY EXISTS
    // ======================================

    $check = $conn->prepare(
        "SELECT id FROM users WHERE email = ? LIMIT 1"
    );

    $check->execute([$email]);


    if ($check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Email address is already registered."
        ]);

        exit;
    }


    // ======================================
    // HASH PASSWORD
    // ======================================

    $hashedPassword = password_hash(
        $password,
        PASSWORD_DEFAULT
    );


    // ======================================
    // INSERT USER
    // ======================================

    $sql = "
        INSERT INTO users
        (
            name,
            email,
            password,
            role
        )
        VALUES
        (
            ?,
            ?,
            ?,
            'customer'
        )
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        $name,
        $email,
        $hashedPassword
    ]);


    // ======================================
    // SUCCESS RESPONSE
    // ======================================

    echo json_encode([
        "success" => true,
        "message" => "Account created successfully!"
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Registration failed: " . $e->getMessage()
    ]);

}

?>