<?php
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
  $data = json_decode(file_get_contents("php://input"));
  
  $title = $data->title;
  $content = $data->content;
  $category = $data->category;
  $user_id = $data->user_id; // Assurez-vous que l'ID de l'utilisateur est passé
  
  $sql = "INSERT INTO posts (title, content, category, user_id) VALUES ('$title', '$content', '$category', '$user_id')";
  
  if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "New post created successfully"]);
  } else {
    echo json_encode(["message" => "Error: " . $sql . "<br>" . $conn->error]);
  }
} else if ($method == 'PUT' || $method == 'DELETE') {
  $data = json_decode(file_get_contents("php://input"));
  $post_id = $data->post_id;
  $user_id = $data->user_id;

  // Check if user is the owner or an admin
  $sql = "SELECT * FROM posts WHERE id='$post_id' AND user_id='$user_id'";
  $result = $conn->query($sql);
  $user_sql = "SELECT * FROM users WHERE id='$user_id' AND role='admin'";
  $user_result = $conn->query($user_sql);

  if ($result->num_rows > 0 || $user_result->num_rows > 0) {
    if ($method == 'PUT') {
      // Update post
      $new_title = $data->title;
      $new_content = $data->content;
      $new_category = $data->category;

      $update_sql = "UPDATE posts SET title='$new_title', content='$new_content', category='$new_category' WHERE id='$post_id'";
      if ($conn->query($update_sql) === TRUE) {
        echo json_encode(["message" => "Post updated successfully"]);
      } else {
        echo json_encode(["message" => "Error: " . $update_sql . "<br>" . $conn->error]);
      }
    } else if ($method == 'DELETE') {
      // Delete post
      $delete_sql = "DELETE FROM posts WHERE id='$post_id'";
      if ($conn->query($delete_sql) === TRUE) {
        echo json_encode(["message" => "Post deleted successfully"]);
      } else {
        echo json_encode(["message" => "Error: " . $delete_sql . "<br>" . $conn->error]);
      }
    }
  } else {
    http_response_code(403);
    echo json_encode(["message" => "Forbidden"]);
  }
}

$conn->close();
?>
