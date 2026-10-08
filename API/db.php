<?php

// ==========================================
// GLOBAL ERROR HANDLING
// ==========================================
// This is the actual fix for "Unable to connect to the server":
// if PHP hits a fatal error or warning anywhere in this request,
// it normally prints raw HTML/text. That breaks response.json()
// on the JS side, which throws and lands in the generic catch
// block ("Unable to connect to the server. Please make sure
// Apache is running") even though Apache is running fine.
//
// These three things force PHP to ALWAYS return valid JSON.

error_reporting(E_ALL);
ini_set('display_errors', '0'); // never let PHP dump raw HTML errors into the response
header("Content-Type: application/json");

set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
    exit;
});

register_shutdown_function(function () {
    $error = error_get_last();

    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Fatal error: " . $error['message']
        ]);
    }
});


// ==========================================
// DATABASE CONNECTION
// ==========================================

$host = "localhost";
$port = 3306;

$dbname = "britny_db";

$username = "root";
$password = ""; // <-- IMPORTANT: change this to your ACTUAL MySQL root password.
                 //     A fresh XAMPP install usually has NO password set for root.
                 //     If you set one yourself in MySQL, put that exact value here.

try {

    $conn = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $conn->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $e->getMessage()
    ]);

    exit;
}

?>