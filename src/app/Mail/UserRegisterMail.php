<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserRegisterMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public mixed $user,
        public mixed $password
    ) {
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.userRegister')
                ->to($this->user->email, $this->user->name . "様")
                ->from(config('email.from.address'), config('app.name'))
                ->subject('ユーザ登録完了のお知らせ')
                ->with([
                    'user' => $this->user,
                    'password' => $this->password,
                ]);
    }
}
