import type { SupportedLocale } from '~/utils/translations'

export interface LocalizedChangelogEntry {
  date: string
  title: string
  changes: string[]
}

export interface LocalizedChangelogCopy {
  entries: LocalizedChangelogEntry[]
  olderEntriesNotice: string
}

export const changelogTranslations: Record<SupportedLocale, LocalizedChangelogCopy> = {
  'en-US': {
    entries: [
      {
        date: '2026-10-04',
        title: 'v2.4 — Critical vote alerts, impostor settings, and usability updates',
        changes: [
          '<b>🚨 Critical vote alerts:</b> Real-time reminders during meetings when the crew is at risk of a double kill, at match point, or when skipping vote is mathematically safe.',
          '<b>👾 Match impostor selector:</b> Quickly set the number of impostors for the match (1, 2, or 3) directly in the lobby bar, defaulting to 3.',
          '<b>📲 App installation prompt:</b> Discreet card to install the app with a friendly 3-day reminder cooldown if dismissed.',
          '<b>🗺️ Interface and map controls:</b> Close hints naturally on outside click or Esc, confirmation before resetting map pins, and flexible color label toggles.',
        ],
      },
      {
        date: '2026-09-21',
        title: 'v2.2 — Investigation hardening and usability polish',
        changes: [
          '<b>🔒 Read-only history snapshots:</b> Past-round snapshots now lock drag-and-drop and context edits so reviewing history cannot change current game data.',
          '<b>🛡️ More resilient sessions:</b> The first-round match is restored after reload for up to two hours, and corrupted browser storage is handled safely.',
          '<b>🔄 Cleaner match reset:</b> New Match resets Impostor Mode and fellow impostors while preserving the active lobby roster.',
          '<b>🎭 Consistent impostor roles:</b> Confirmed impostor roles now move consistently into the fellow-impostor column.',
          '<b>🌐 Localized tasks and locations:</b> Official names are available in all six supported languages; tan is localized as “Cáqui” in pt-BR.',
          '<b>🎙️ Voice input controls:</b> Speech language follows the browser language by default, with a dedicated language selector and permission controls.',
          '<b>🍪 Clearer privacy notice:</b> The notice names production analytics and diagnostics and links to the privacy policy.',
          '<b>📱 Better roster support on phones:</b> The color picker stays within narrow screens, and meeting counts require manual entry.',
        ],
      },
      {
        date: '2026-09-20',
        title: 'v2.1 — Performance, shortcuts, and help updates',
        changes: [
          '<b>⚡ Performance:</b> Added a Settings option to disable animations for a simpler, lower-motion interface.',
          '<b>📚 Help redesign:</b> Updated the help panel layout and expanded its setup, Impostor Mode, and shortcut guidance.',
          '<b>⌨️ Keyboard shortcuts:</b> Added quick keys for Notes (N), Map (M), Tasks (T), Impostor Mode (I), roster (L), and closing or minimizing (Esc).',
          '<b>📜 Credits and disclaimer:</b> Clarified creator credits, added a viewer for the archived original letter, and explained where donations go.',
          '<b>🌐 Language support:</b> Added translations for the main interface in all six supported languages.',
        ],
      },
    ],
    olderEntriesNotice: 'Earlier release notes are shown in English.',
  },
  'pt-BR': {
    entries: [
      {
        date: '2026-10-04',
        title: 'v2.4 — Alertas de votação crítica, ajuste de impostores e usabilidade',
        changes: [
          '<b>🚨 Alertas de votação crítica:</b> Avisos em tempo real durante reuniões quando a tripulação corre risco de double kill, em ponto decisivo ou quando pular o voto é seguro.',
          '<b>👾 Seletor de impostores:</b> Escolha rápida da quantidade de impostores na partida (1, 2 ou 3) direto na barra do lobby, com padrão em 3.',
          '<b>📲 Instalação do app (PWA):</b> Notificação discreta para instalar o aplicativo, com lembrete a cada 3 dias se fechada.',
          '<b>🗺️ Controles de interface e mapa:</b> Fechamento de avisos ao clicar fora ou apertar Esc, confirmação para resetar posições no mapa e opção para ocultar nomes das cores.',
        ],
      },
      {
        date: '2026-09-21',
        title: 'v2.2 — Melhorias de robustez e usabilidade',
        changes: [
          '<b>🔒 Histórico somente para leitura:</b> Os registros de rodadas anteriores agora bloqueiam arrastar e soltar e edições pelo menu, evitando alterações nos dados atuais ao consultar o histórico.',
          '<b>🛡️ Sessões mais resilientes:</b> A partida da primeira rodada é restaurada após recarregar a página por até duas horas, e dados corrompidos do navegador são tratados com segurança.',
          '<b>🔄 Reinício de partida aprimorado:</b> Nova Partida reinicia o Modo Impostor e os impostores aliados, preservando a escalação ativa do lobby.',
          '<b>🎭 Funções de impostor consistentes:</b> Funções de impostor confirmadas agora são direcionadas corretamente à coluna de aliados.',
          '<b>🌐 Tarefas e locais traduzidos:</b> Os nomes oficiais estão disponíveis nos seis idiomas compatíveis; “tan” foi traduzido como “Cáqui” em pt-BR.',
          '<b>🎙️ Controles de voz:</b> O idioma da fala segue o idioma do navegador por padrão, com seletor de idioma e controles de permissão próprios.',
          '<b>🍪 Aviso de privacidade mais claro:</b> O aviso informa quais análises e diagnósticos são enviados em produção e inclui um link para a política de privacidade.',
          '<b>📱 Melhor suporte ao lobby em celulares:</b> O seletor de cores fica dentro da tela em dispositivos estreitos, e a contagem de reuniões exige entrada manual.',
        ],
      },
      {
        date: '2026-09-20',
        title: 'v2.1 — Desempenho, atalhos e ajuda',
        changes: [
          '<b>⚡ Desempenho:</b> Foi adicionada às configurações uma opção para desativar animações e reduzir o movimento na interface.',
          '<b>📚 Ajuda reformulada:</b> O painel de ajuda foi reorganizado, com orientações ampliadas sobre preparação, Modo Impostor e atalhos.',
          '<b>⌨️ Atalhos de teclado:</b> Acesso rápido a Notas (N), Mapa (M), Tarefas (T), Modo Impostor (I), escalação (L) e fechar ou minimizar (Esc).',
          '<b>📜 Créditos e aviso:</b> Créditos dos criadores esclarecidos, visualizador da carta original arquivada adicionado e destino das doações explicado.',
          '<b>🌐 Idiomas:</b> A interface principal foi traduzida para os seis idiomas compatíveis.',
        ],
      },
    ],
    olderEntriesNotice: 'As notas de versões anteriores são exibidas em inglês.',
  },
  'es-ES': {
    entries: [
      {
        date: '2026-10-04',
        title: 'v2.4 — Alertas de votación crítica, ajuste de impostores y usabilidad',
        changes: [
          '<b>🚨 Alertas de votación crítica:</b> Avisos en tiempo real durante reuniones cuando la tripulación está en riesgo de double kill, punto decisivo o cuando saltar el voto es seguro.',
          '<b>👾 Selector de impostores:</b> Configuración rápida de la cantidad de impostores (1, 2 o 3) directamente en el lobby, con valor inicial en 3.',
          '<b>📲 Instalación de la app:</b> Aviso discreto para instalar la aplicación con recordatorio cada 3 días si se descarta.',
          '<b>🗺️ Controles de interfaz y mapa:</b> Cierre de ventanas al hacer clic fuera o pulsar Esc, confirmación para reiniciar posiciones en el mapa y ajuste de etiquetas de color.',
        ],
      },
      {
        date: '2026-09-21',
        title: 'v2.2 — Mejoras de robustez y uso',
        changes: [
          '<b>🔒 Historial de solo lectura:</b> Las instantáneas de rondas anteriores bloquean ahora el arrastre y las ediciones contextuales para que consultar el historial no cambie los datos actuales.',
          '<b>🛡️ Sesiones más resistentes:</b> La partida de la primera ronda se restaura tras recargar durante un máximo de dos horas, y los datos dañados del navegador se gestionan de forma segura.',
          '<b>🔄 Reinicio de partida mejorado:</b> Nueva partida reinicia el modo Impostor y los impostores aliados, pero conserva la lista activa del lobby.',
          '<b>🎭 Roles de impostor coherentes:</b> Los roles de impostor confirmados se trasladan ahora correctamente a la columna de aliados.',
          '<b>🌐 Tareas y ubicaciones traducidas:</b> Los nombres oficiales están disponibles en los seis idiomas compatibles; “tan” se traduce como “Cáqui” en pt-BR.',
          '<b>🎙️ Controles de voz:</b> El idioma del reconocimiento sigue el del navegador de forma predeterminada, con selector de idioma y controles de permisos propios.',
          '<b>🍪 Aviso de privacidad más claro:</b> El aviso identifica las analíticas y los diagnósticos enviados en producción e incluye un enlace a la política de privacidad.',
          '<b>📱 Mejor adaptación del lobby al móvil:</b> El selector de colores permanece dentro de pantallas estrechas y el contador de reuniones requiere entrada manual.',
        ],
      },
      {
        date: '2026-09-20',
        title: 'v2.1 — Rendimiento, atajos y ayuda',
        changes: [
          '<b>⚡ Rendimiento:</b> Se añadió a Ajustes una opción para desactivar animaciones y reducir el movimiento de la interfaz.',
          '<b>📚 Ayuda renovada:</b> Se reorganizó el panel de ayuda y se ampliaron las guías de configuración, modo Impostor y atajos.',
          '<b>⌨️ Atajos de teclado:</b> Acceso rápido a Notas (N), Mapa (M), Tareas (T), modo Impostor (I), lista de jugadores (L) y cerrar o minimizar (Esc).',
          '<b>📜 Créditos y aviso:</b> Se aclararon los créditos, se añadió un visor de la carta original archivada y se explicó el destino de las donaciones.',
          '<b>🌐 Idiomas:</b> La interfaz principal se tradujo a los seis idiomas disponibles.',
        ],
      },
    ],
    olderEntriesNotice: 'Las notas de versiones anteriores se muestran en inglés.',
  },
  'fr-FR': {
    entries: [
      {
        date: '2026-10-04',
        title: 'v2.4 — Alertes de vote critique, réglage des imposteurs et confort de jeu',
        changes: [
          '<b>🚨 Alertes de vote critique :</b> Rappels en direct pendant les réunions en cas de risque de double kill, de manche décisive ou lorsque passer le vote est mathématiquement sûr.',
          '<b>👾 Sélecteur d’imposteurs :</b> Choix rapide du nombre d’imposteurs (1, 2 ou 3) directement dans la barre du lobby, réglé par défaut sur 3.',
          '<b>📲 Installation de l’application :</b> Notification discrète d’installation avec un rappel tous les 3 jours en cas de fermeture.',
          '<b>🗺️ Commandes d’interface et carte :</b> Fermeture facile des bulles en cliquant dehors ou avec Échap, confirmation avant réinitialisation de la carte et gestion des noms de couleurs.',
        ],
      },
      {
        date: '2026-09-21',
        title: 'v2.2 — Fiabilité et confort d’utilisation',
        changes: [
          '<b>🔒 Historique en lecture seule :</b> Les instantanés des manches précédentes bloquent désormais le glisser-déposer et les modifications contextuelles afin que leur consultation ne change pas les données actuelles.',
          '<b>🛡️ Sessions plus robustes :</b> La partie de la première manche est restaurée après rechargement pendant deux heures au maximum ; les données de navigateur endommagées sont gérées sans risque.',
          '<b>🔄 Réinitialisation améliorée :</b> Nouvelle partie réinitialise le mode Imposteur et les imposteurs alliés tout en conservant le groupe actif du lobby.',
          '<b>🎭 Rôles d’imposteur cohérents :</b> Les rôles d’imposteur confirmés sont désormais placés correctement dans la colonne des alliés.',
          '<b>🌐 Tâches et lieux traduits :</b> Les noms officiels sont disponibles dans les six langues prises en charge ; « tan » devient « Cáqui » en pt-BR.',
          '<b>🎙️ Commandes vocales :</b> La langue de reconnaissance suit celle du navigateur par défaut, avec un sélecteur dédié et des commandes d’autorisation.',
          '<b>🍪 Avis de confidentialité plus clair :</b> L’avis précise les mesures d’audience et données de diagnostic envoyées en production et renvoie vers la politique de confidentialité.',
          '<b>📱 Lobby mieux adapté au mobile :</b> Le sélecteur de couleurs reste dans les petits écrans et le compteur de réunions demande une saisie manuelle.',
        ],
      },
      {
        date: '2026-09-20',
        title: 'v2.1 — Performances, raccourcis et aide',
        changes: [
          '<b>⚡ Performances :</b> Une option des paramètres permet de désactiver les animations et de réduire les mouvements de l’interface.',
          '<b>📚 Aide repensée :</b> Le panneau d’aide a été réorganisé et ses conseils sur la préparation, le mode Imposteur et les raccourcis ont été étoffés.',
          '<b>⌨️ Raccourcis clavier :</b> Accès rapide aux Notes (N), à la Carte (M), aux Tâches (T), au mode Imposteur (I), au roster (L) et à la fermeture ou réduction (Esc).',
          '<b>📜 Crédits et avis :</b> Crédits des créateurs clarifiés, lecteur de la lettre originale archivée ajouté et destination des dons expliquée.',
          '<b>🌐 Langues :</b> L’interface principale a été traduite dans les six langues prises en charge.',
        ],
      },
    ],
    olderEntriesNotice: 'Les notes des anciennes versions sont affichées en anglais.',
  },
  'de-DE': {
    entries: [
      {
        date: '2026-10-04',
        title: 'v2.4 — Kritische Abstimmungshinweise, Impostor-Auswahl und Bedienung',
        changes: [
          '<b>🚨 Kritische Abstimmungshinweise:</b> Echtzeit-Warnungen bei Besprechungen bei Gefahr eines Double Kills, am Match Point oder wenn ein Skip mathematisch sicher ist.',
          '<b>👾 Impostor-Auswahl:</b> Schnelle Einstellung der Impostor-Anzahl (1, 2 oder 3) direkt in der Lobby-Leiste, standardmäßig auf 3 gesetzt.',
          '<b>📲 App-Installation:</b> Dezenter Hinweis zur Installation als App mit einer 3-Tage-Erinnerung bei Schließen.',
          '<b>🗺️ Oberflächen- und Kartensteuerung:</b> Hinweise schließen bei Klick außerhalb oder Esc, Bestätigung vor dem Zurücksetzen der Kartenpins und anpassbare Farbnamen.',
        ],
      },
      {
        date: '2026-09-21',
        title: 'v2.2 — Mehr Stabilität und bessere Bedienung',
        changes: [
          '<b>🔒 Verlauf nur zum Lesen:</b> Schnappschüsse früherer Runden sperren jetzt Ziehen und Kontextmenü-Bearbeitungen, damit die aktuelle Partie beim Nachsehen unverändert bleibt.',
          '<b>🛡️ Robustere Sitzungen:</b> Die Partie aus Runde eins wird nach dem Neuladen bis zu zwei Stunden wiederhergestellt; beschädigte Browserdaten werden sicher behandelt.',
          '<b>🔄 Besserer Partiewechsel:</b> Neues Spiel setzt den Impostor-Modus und verbündete Impostoren zurück, behält aber die aktive Lobby-Aufstellung bei.',
          '<b>🎭 Einheitliche Impostor-Rollen:</b> Bestätigte Impostor-Rollen landen jetzt korrekt in der Spalte für verbündete Impostoren.',
          '<b>🌐 Übersetzte Aufgaben und Orte:</b> Offizielle Namen sind in allen sechs unterstützten Sprachen verfügbar; „tan“ heißt auf pt-BR „Cáqui“.',
          '<b>🎙️ Spracheingabe:</b> Die Erkennungssprache richtet sich standardmäßig nach der Browsersprache; ein eigener Sprachwähler und Berechtigungssteuerungen sind hinzugekommen.',
          '<b>🍪 Klarerer Datenschutzhinweis:</b> Der Hinweis nennt die in der Produktionsumgebung gesendeten Analyse- und Diagnosedaten und verlinkt die Datenschutzerklärung.',
          '<b>📱 Bessere Lobby auf Mobilgeräten:</b> Der Farbwähler bleibt auf schmalen Bildschirmen im sichtbaren Bereich; Besprechungszähler werden manuell eingegeben.',
        ],
      },
      {
        date: '2026-09-20',
        title: 'v2.1 — Leistung, Tastenkürzel und Hilfe',
        changes: [
          '<b>⚡ Leistung:</b> Eine neue Einstellung schaltet Animationen aus und verringert Bewegungen in der Oberfläche.',
          '<b>📚 Hilfe überarbeitet:</b> Das Hilfefenster wurde neu angeordnet und um Hinweise zu Lobby, Impostor-Modus und Tastenkürzeln erweitert.',
          '<b>⌨️ Tastenkürzel:</b> Schneller Zugriff auf Notizen (N), Karte (M), Aufgaben (T), Impostor-Modus (I), Spielerliste (L) und Schließen oder Minimieren (Esc).',
          '<b>📜 Credits und Haftungshinweis:</b> Urheberangaben präzisiert, Anzeige des archivierten Originalbriefs ergänzt und Zweck der Spenden erläutert.',
          '<b>🌐 Sprachen:</b> Die Hauptoberfläche wurde in alle sechs unterstützten Sprachen übersetzt.',
        ],
      },
    ],
    olderEntriesNotice: 'Ältere Versionshinweise werden auf Englisch angezeigt.',
  },
  'ko-KR': {
    entries: [
      {
        date: '2026-10-04',
        title: 'v2.4 — 위험 투표 알림, 임포스터 수 설정 및 사용성 개선',
        changes: [
          '<b>🚨 위험 투표 알림:</b> 회의 중 더블킬 위험, 최종 결정전, 또는 안전하게 스킵할 수 있는 상황을 실시간으로 알려줍니다.',
          '<b>👾 임포스터 인원 설정:</b> 로비 바에서 게임의 임포스터 수(1, 2, 3명)를 빠르게 선택할 수 있으며 기본값은 3명입니다.',
          '<b>📲 앱 설치 안내:</b> 부담 없는 앱 설치 안내 창과 닫았을 때 3일 후 다시 알림 기능을 제공합니다.',
          '<b>🗺️ 인터페이스 및 지도 개선:</b> 외부 클릭이나 Esc로 안내창 닫기, 지도 핀 초기화 전 확인 절차, 색상 이름 표시 설정이 추가되었습니다.',
        ],
      },
      {
        date: '2026-09-21',
        title: 'v2.2 — 조사 기록 안정성과 사용성 개선',
        changes: [
          '<b>🔒 읽기 전용 기록 스냅샷:</b> 이전 라운드 스냅샷에서 드래그 이동과 메뉴 편집을 잠가, 기록을 확인할 때 현재 게임 데이터가 바뀌지 않도록 했습니다.',
          '<b>🛡️ 세션 안정성 개선:</b> 첫 라운드의 게임은 새로고침 후 최대 두 시간 동안 복원되며, 손상된 브라우저 저장 데이터도 안전하게 처리합니다.',
          '<b>🔄 새 게임 초기화 개선:</b> 새 게임을 시작하면 임포스터 모드와 같은 팀 임포스터 정보가 초기화되고, 현재 로비 인원은 유지됩니다.',
          '<b>🎭 일관된 임포스터 역할:</b> 확인된 임포스터 역할이 같은 팀 임포스터 열로 올바르게 이동합니다.',
          '<b>🌐 임무 및 장소 번역:</b> 지원하는 여섯 언어로 공식 이름을 표시합니다. pt-BR에서는 황갈색을 “Cáqui”로 번역했습니다.',
          '<b>🎙️ 음성 입력 설정:</b> 기본 음성 인식 언어가 브라우저 언어를 따르며, 전용 언어 선택기와 권한 제어 기능이 추가되었습니다.',
          '<b>🍪 더 명확한 개인정보 안내:</b> 운영 환경에서 전송되는 분석 및 진단 데이터를 밝히고 개인정보 처리방침으로 연결합니다.',
          '<b>📱 모바일 로비 개선:</b> 좁은 화면에서도 색상 선택기가 화면 밖으로 나가지 않으며, 회의 횟수는 직접 입력합니다.',
        ],
      },
      {
        date: '2026-09-20',
        title: 'v2.1 — 성능, 단축키 및 도움말 개선',
        changes: [
          '<b>⚡ 성능:</b> 설정에서 애니메이션을 끄고 인터페이스의 움직임을 줄일 수 있습니다.',
          '<b>📚 도움말 개편:</b> 도움말 화면을 재구성하고 로비 설정, 임포스터 모드, 단축키 설명을 보강했습니다.',
          '<b>⌨️ 키보드 단축키:</b> 메모(N), 지도(M), 임무(T), 임포스터 모드(I), 플레이어 목록(L), 닫기 또는 최소화(Esc)에 빠르게 접근할 수 있습니다.',
          '<b>📜 제작자 정보 및 안내:</b> 제작자 정보를 명확히 하고, 보관된 원본 편지 보기와 기부금 안내를 추가했습니다.',
          '<b>🌐 언어 지원:</b> 기본 인터페이스를 지원하는 여섯 언어로 번역했습니다.',
        ],
      },
    ],
    olderEntriesNotice: '이전 버전의 변경 사항은 영어로 표시됩니다.',
  },
}
