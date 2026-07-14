(() => {
  const cfg = window.WEDDING_CONFIG;
  const $ = (id) => document.getElementById(id);

  $('brideName').textContent = cfg.couple.bride;
  $('groomName').textContent = cfg.couple.groom;
  $('displayDate').textContent = cfg.displayDate;
  $('invitationDate').textContent = cfg.displayDate;
  $('invitationText').textContent = cfg.invitationText;
  $('venueName').textContent = cfg.venue;
  $('venueCity').textContent = cfg.city;
  $('mapButton').href = cfg.mapUrl;

  const params = new URLSearchParams(location.search);
  const guestName = (params.get('guest') || '').trim();
  const greeting = params.get('greeting') || '';
  $('guestGreeting').textContent = guestName
    ? `${greeting || (/[,и&]/i.test(guestName) ? 'Дорогие' : 'Дорогой гость')}, ${guestName}!`
    : 'Дорогие гости!';

  const timeline = $('timeline');
  cfg.story.forEach((item) => {
    const node = document.createElement('article');
    node.className = 'timeline-item reveal';
    node.innerHTML = `
      <div class="timeline-item__marker"></div>
      <div class="timeline-item__year"></div>
      <h3></h3>
      <div class="timeline-item__text"></div>
      <div class="story-facts" hidden></div>
    `;
    node.querySelector('.timeline-item__marker').textContent = item.icon || '♡';
    node.querySelector('.timeline-item__year').textContent = item.year;
    node.querySelector('h3').textContent = item.title;

    const text = node.querySelector('.timeline-item__text');
    (item.paragraphs || [item.text]).filter(Boolean).forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      text.appendChild(p);
    });

    if (item.facts?.length) {
      const facts = node.querySelector('.story-facts');
      facts.hidden = false;
      item.facts.forEach((fact) => {
        const span = document.createElement('span');
        span.textContent = fact;
        facts.appendChild(span);
      });
    }
    timeline.appendChild(node);
  });

  const eventTime = new Date(cfg.eventDate).getTime();
  function updateCountdown() {
    const diff = eventTime - Date.now();
    if (diff <= 0) {
      $('countdown').hidden = true;
      $('todayMessage').hidden = false;
      return;
    }
    $('days').textContent = Math.floor(diff / 86400000);
    $('hours').textContent = Math.floor((diff % 86400000) / 3600000);
    $('minutes').textContent = Math.floor((diff % 3600000) / 60000);
    $('seconds').textContent = Math.floor((diff % 60000) / 1000);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();
