<?php


//  Config
//  --------------------------------------------------

$config = array(

    // This is the email address where notifications about new subscribers will be sent
    'admin_email' => 'example@example.com',

    // Subscription method can be set to: 'file', 'mailchimp' or 'campaignmonitor'
    'subscription_method' =>  'file',

    // MailChimp API key and list ID. See documentation for more information
    'mailchimp_config' => array(
        'api_key'   => 'mailchimp_api_key',
        'list_id'   => 'mailchimp_list_id'
    ),

    // CampaignMonitor API key and list ID. See documentation for more information
    'campaignmonitor_config' => array(
        'api_key'   => 'campaignmonitor_api_key',
        'list_id'   => 'campaignmonitor_list_id'
    ),
);


//  Helper functions
//  --------------------------------------------------

if ( isset( $_SERVER['HTTP_X_REQUESTED_WITH'] )
    && strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) == 'xmlhttprequest' ) {

    $functions = array( 'contact', 'newsletter' );

    if ( ! empty( $_POST ) && isset( $_POST['action'] ) && in_array( $_POST['action'], $functions ) ) {
        echo json_encode( call_user_func( $_POST['action'], $_POST ) );
        die();
    }
}


//  Handle contact messages
//  --------------------------------------------------

function contact( $data ) {
    global $config;

    $response = array( 'field' => 'message', 'status' => 'success', 'message' => "Thank you! We'll be in touch!" );

    if ( ! isset( $data['email'] ) || '' === $data['email'] ) {
        $response = array( 'field' => 'email', 'status' => 'error', 'message' => 'Please provide an email address' );
    }
    elseif ( ! isset( $data['message'] ) || '' === $data['email'] ) {
        $response = array( 'field' => 'message', 'status' => 'error', 'message' => 'Please enter a message' );
    }
    else {
        $email = filter_var( strtolower( trim( $data['email'] ) ), FILTER_SANITIZE_EMAIL );

        if ( ! strpos( $email, '@' ) ) {
            $response = array( 'field' => 'email', 'status' => 'error', 'message' => "Invalid email address" );
        }
    }

    // If all is fine, send an email to the administrator
    if ( 'success' === $response['status'] ) {
        $mail = mail( $config['admin_email'], 'Contact message from ' . $email, stripslashes( $data['message'] ), 'From: ' . $email . "\r\n" . 'Reply-To: ' . $email . "\r\n" );
    }

    return $response;
}


//  Handle newsletter subscription
//  --------------------------------------------------

function newsletter( $data ) {
    global $config;

    $response = array( 'field' => 'email', 'status' => 'success', 'message' => "Thank you! We'll be in touch!" );

    if ( ! isset( $data['email'] ) || '' === $data['email'] ) {
        $response = array( 'field' => 'email', 'status' => 'error', 'message' => 'Please provide an email address' );
    }
    else {
        $email = filter_var( strtolower( trim( $data['email'] ) ), FILTER_SANITIZE_EMAIL );

        if ( strpos( $email, '@' ) ) {
            switch ( $config['subscription_method'] ) {
            case 'mailchimp':
                require_once 'api/MailChimp.class.php';
                $MailChimp = new MailChimp( $config['mailchimp_config']['api_key'] );
                $result = $MailChimp->call( 'lists/subscribe', array(
                        'id'            => $config['mailchimp_config']['list_id'],
                        'email'         => array( 'email' => $email ),
                        'double_optin'  => false,
                        'send_welcome'  => true
                    ) );

                if ( isset( $result['code'] ) && 214 !== $result['code'] ) {
                    $response = array( 'field' => 'email', 'status' => 'error', 'message' => "Oops. Something went wrong." );

                    mail( $config['admin_email'], 'Subscription error', "The following error occured while a used was trying to subscribe to your newsletter: \r\n" . $result['error'], 'From: ' . $email . "\r\n" . 'Reply-To: ' . $email . "\r\n" );
                }
                else if ( isset( $result['code'] ) && 214 === $result['code'] ) {
                        $response = array( 'field' => 'email', 'status' => 'success', 'message' => "You are already subscribed!" );
                    }

                break;

            case 'campaignmonitor':
                require_once 'api/CampaignMonitor.class.php';

                $wrap = new CS_REST_Subscribers( $config['campaignmonitor_config']['list_id'], $config['campaignmonitor_config']['api_key'] );
                $result = $wrap->add ( array(
                        'EmailAddress' => $email,
                        'Resubscribe' => true
                    ) );

                if ( isset( $result->response->Message ) ) {
                    $response = array( 'field' => 'email', 'status' => 'error', 'message' => $result->response->Message );
                }

                break;

            case 'file':
            default:
                define( 'HAS_ACCESS', true );

                $emails = file_get_contents( 'subscribers.php' );

                if ( strpos( $emails, $email ) ) {
                    $response = array( 'field' => 'email', 'status' => 'success', 'message' => "You are already subscribed!" );
                }
                else {
                    file_put_contents( 'subscribers.php', $email . "\r\n" , FILE_APPEND );
                }

                break;
            }
        }
        else {
            $response = array( 'field' => 'email', 'status' => 'error', 'message' => "Invalid email address" );
        }
    }

    // If all is fine, send an email to the administrator
    if ( 'success' === $response['status'] ) {
        $mail = mail( $config['admin_email'], 'Newsletter signup', $email . ' has subscribed to your newsletter', 'From: ' . $email . "\r\n" . 'Reply-To: ' . $email . "\r\n" );
    }

    return $response;
}
