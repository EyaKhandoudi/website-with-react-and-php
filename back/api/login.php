<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

$username = $data->username;
$password = md5($data->password);

$sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  echo json_encode(["message" => "Login successful"]);
} else {
  http_response_code(401);
  echo json_encode(["message" => "Invalid credentials"]);
}

$conn->close();
?>
