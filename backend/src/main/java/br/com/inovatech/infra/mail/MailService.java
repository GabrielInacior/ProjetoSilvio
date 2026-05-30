package br.com.inovatech.infra.mail;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import br.com.inovatech.modules.pedido.PedidoResumoDto;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Async
    public void sendPasswordReset(String toEmail, String nome, String link) {
        Context ctx = new Context();
        ctx.setVariable("nome", nome);
        ctx.setVariable("link", link);
        String html = templateEngine.process("email/password-reset", ctx);
        send(toEmail, "Redefinição de senha — Inovatech", html);
    }

    @Async
    public void sendWelcome(String toEmail, String nome, String ra) {
        Context ctx = new Context();
        ctx.setVariable("nome", nome);
        ctx.setVariable("ra", ra);
        String html = templateEngine.process("email/welcome", ctx);
        send(toEmail, "Bem-vindo à Inovatech!", html);
    }

    @Async
    public void sendOrderConfirmation(String toEmail, String nome, PedidoResumoDto pedido) {
        Context ctx = new Context();
        ctx.setVariable("nome", nome);
        ctx.setVariable("pedido", pedido);
        String html = templateEngine.process("email/order-confirmation", ctx);
        send(toEmail, "Pedido #" + pedido.id() + " confirmado — Inovatech", html);
    }

    @Async
    public void sendGeneric(String toEmail, String subject, String templateName, Context ctx) {
        String html = templateEngine.process(templateName, ctx);
        send(toEmail, subject, html);
    }

    private void send(String to, String subject, String htmlContent) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(msg);
            log.info("Email sent to {} subject={}", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
