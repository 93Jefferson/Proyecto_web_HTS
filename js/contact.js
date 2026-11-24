/**
 * ==========================================================================
 * PORTAFOLIO WEB PERSONAL - LÓGICA DE CONTACTO (contact.js)
 * Funcionalidad exclusiva para contact.html:
 * 1. Copiar correo electrónico al portapapeles con navigator.clipboard
 * 2. Validación formal en tiempo real y al enviar los campos del formulario
 * 3. Envío directo sin backend por Correo (mailto:)
 * 4. Envío directo sin backend por WhatsApp (wa.me)
 * ==========================================================================
 */

// CONFIGURACIÓN OFICIAL (Ing. Jefferson Guaranda Soledispa)
const CONTACT_CONFIG = {
  email: 'jeffergs_@hotmail.com',
  whatsappPhone: '593969935368'
};

document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copy-email-btn');
  const contactForm = document.getElementById('contact-form');
  const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
  const feedbackContainer = document.getElementById('form-feedback');

  // ------------------------------------------------------------------------
  // 1. COPIAR CORREO AL PORTAPAPELES
  // ------------------------------------------------------------------------
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const originalText = copyBtn.textContent;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(CONTACT_CONFIG.email);
        } else {
          // Fallback para contextos HTTP o navegadores legacy
          const tempInput = document.createElement('input');
          tempInput.value = CONTACT_CONFIG.email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Feedback sutil en el botón
        copyBtn.textContent = 'Dirección copiada';
        copyBtn.classList.add('btn-copied');

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('btn-copied');
        }, 2200);
      } catch (error) {
        console.error('Error al copiar al portapapeles:', error);
        copyBtn.textContent = 'Error al copiar';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 2. MOSTRAR FEEDBACK / ALERTAS DEL FORMULARIO
  // ------------------------------------------------------------------------
  function showFeedback(message, type = 'error') {
    if (!feedbackContainer) return;

    feedbackContainer.textContent = message;
    feedbackContainer.className = `form-feedback ${type}`;
    feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearFeedback() {
    if (!feedbackContainer) return;
    feedbackContainer.textContent = '';
    feedbackContainer.className = 'form-feedback';
  }

  // ------------------------------------------------------------------------
  // 3. VALIDACIÓN ESTRICTA DE CAMPOS
  // ------------------------------------------------------------------------
  function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      showFeedback('Por favor, ingrese su nombre y apellido.', 'error');
      nameInput.focus();
      return null;
    }

    if (!email) {
      showFeedback('Por favor, ingrese su dirección de correo electrónico.', 'error');
      emailInput.focus();
      return null;
    }

    // Validación de formato de correo corporativo / personal
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Por favor, ingrese un correo electrónico válido (ejemplo: usuario@empresa.com).', 'error');
      emailInput.focus();
      return null;
    }

    if (!subject) {
      showFeedback('Por favor, indique el asunto de su requerimiento.', 'error');
      subjectInput.focus();
      return null;
    }

    if (!message || message.length < 5) {
      showFeedback('Por favor, describa su requerimiento o mensaje con mayor detalle.', 'error');
      messageInput.focus();
      return null;
    }

    clearFeedback();
    return { name, email, subject, message };
  }

  // ------------------------------------------------------------------------
  // 4. ENVÍO POR CORREO ELECTRÓNICO (SUBMIT FORM -> MAILTO)
  // ------------------------------------------------------------------------
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = validateForm();
      if (!formData) return;

      const bodyText = `Estimado Ing. Jefferson Guaranda,\n\n` +
                       `Mi nombre es ${formData.name}.\n` +
                       `Correo de contacto: ${formData.email}\n\n` +
                       `Asunto: ${formData.subject}\n\n` +
                       `Detalle del mensaje:\n${formData.message}`;

      const mailtoUrl = `mailto:${CONTACT_CONFIG.email}` +
                        `?subject=${encodeURIComponent(formData.subject)}` +
                        `&body=${encodeURIComponent(bodyText)}`;

      showFeedback('Abriendo su cliente de correo predeterminado...', 'success');
      window.location.href = mailtoUrl;
    });
  }

  // ------------------------------------------------------------------------
  // 5. ENVÍO POR WHATSAPP (BOTÓN WHATSAPP -> WA.ME)
  // ------------------------------------------------------------------------
  if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', () => {
      const formData = validateForm();
      if (!formData) return;

      const whatsappText = `*Requerimiento - Portafolio Profesional*\n\n` +
                           `Remitente: ${formData.name}\n` +
                           `Correo: ${formData.email}\n` +
                           `Asunto: ${formData.subject}\n\n` +
                           `Mensaje:\n${formData.message}`;

      const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappPhone}?text=${encodeURIComponent(whatsappText)}`;

      showFeedback('Redirigiendo a WhatsApp...', 'success');
      window.open(whatsappUrl, '_blank');
    });
  }
});
