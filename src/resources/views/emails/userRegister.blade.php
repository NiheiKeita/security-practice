<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <h1>ユーザ登録が完了しました</h1>
    <p>ユーザ登録が完了いたしました。</p>
    <p><strong>メールアドレス:</strong> {{ $user->email }}</p>
    <p><strong>パスワード:</strong> {{ $password }}</p>
    <br/>
    <p>下記のリンクからログインし、パスワードを変更してください。</p>
    <p><strong>ログインURL:</strong> <a href="{{ route('user.login') }}">{{ route('user.login') }}</a></p>
</body>
</html>
