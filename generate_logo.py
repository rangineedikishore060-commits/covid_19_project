import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(figsize=(2.5, 2.5), dpi=300)
ax.axis('off')

# Outer circle
circle1 = plt.Circle((0.5, 0.5), 0.46, color='#ea580c', fill=False, linewidth=3)
circle2 = plt.Circle((0.5, 0.5), 0.42, color='#1e3a8a', fill=False, linewidth=1.5)
ax.add_patch(circle1)
ax.add_patch(circle2)

# Sunburst / gear rays
for theta in np.linspace(0, 2*np.pi, 24, endpoint=False):
    x1 = 0.5 + 0.28 * np.cos(theta)
    y1 = 0.5 + 0.28 * np.sin(theta)
    x2 = 0.5 + 0.38 * np.cos(theta)
    y2 = 0.5 + 0.38 * np.sin(theta)
    ax.plot([x1, x2], [y1, y2], color='#ea580c', linewidth=2)

center_circle = plt.Circle((0.5, 0.5), 0.24, color='#1e3a8a', fill=True)
ax.add_patch(center_circle)
ax.text(0.5, 0.5, "AU", color='white', ha='center', va='center', fontsize=20, fontweight='bold', family='sans-serif')

ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
plt.savefig("report_figures/aditya_logo.png", dpi=300, bbox_inches='tight', transparent=True)
plt.close()
print("Aditya University emblem generated!")
