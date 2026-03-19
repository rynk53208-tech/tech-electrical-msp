# TOOLS.md - Local Notes

## GitHub Configuration

- **Email:** rynk53208@gmail.com
- **PAT:** (stored in environment variable `GITHUB_TOKEN`)
- **Org:** rynk53208-tech

### Repos
| Project | URL |
|---------|-----|
| tech-electrical-msp | https://github.com/rynk53208-tech/tech-electrical-msp |
| tech-electrical-portal | https://github.com/rynk53208-tech/tech-electrical-portal |

### Setup Required
1. Generate a Personal Access Token (PAT) on GitHub with repo permissions
2. Use PAT as password when pushing via HTTPS
3. Or set up SSH key for passwordless pushes

---

## SSH

- home-server → 192.168.1.100, user: admin

---

## Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

---

## TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod

---

## API Keys & Model Strategy

### Claude (Thinker)
- **Key:** (stored in environment variable `ANTHROPIC_API_KEY`)
- **Use:** Reasoning/thinking only (system-level)

### GitHub
- **PAT:** (stored in environment variable `GITHUB_TOKEN`)
- **Org:** rynk53208-tech
| Purpose | Model | Cost |
|---------|-------|------|
| Thinking/Reasoning | Claude (user-provided) | Paid from key |
| Default (all agents) | nano (gpt-5-nano) | ~$0.01/1k tokens |
| Fallback | haiku | ~$0.02/1k tokens |

### Budget Rule
- **$25 for 30 days** = $0.83/day max
- Only use expensive models (sonnet, opus, deepseek) when nano/haiku fail
- Track spend via session_status
