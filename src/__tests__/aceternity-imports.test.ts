import { describe, it, expect } from 'vitest';

describe('Aceternity Components Import Tests', () => {
    it('should import BackgroundBeams component', async () => {
        const module = await import('@/components/ui/background-beams');
        expect(module.BackgroundBeams).toBeDefined();
    });

    it('should import 3D Card components', async () => {
        const module = await import('@/components/ui/3d-card');
        expect(module.CardContainer).toBeDefined();
        expect(module.CardBody).toBeDefined();
        expect(module.CardItem).toBeDefined();
    });

    it('should import Sparkles component', async () => {
        const module = await import('@/components/ui/sparkles');
        expect(module.SparklesCore).toBeDefined();
    });

    it('should import MovingBorder component', async () => {
        const module = await import('@/components/ui/moving-border');
        expect(module.MovingBorder).toBeDefined();
    });

    it('should import Lamp component', async () => {
        const module = await import('@/components/ui/lamp');
        expect(module.LampContainer).toBeDefined();
    });

    it('should import HoverBorderGradient component', async () => {
        const module = await import('@/components/ui/hover-border-gradient');
        expect(module.HoverBorderGradient).toBeDefined();
    });

    it('should import Spotlight component', async () => {
        const module = await import('@/components/ui/spotlight');
        expect(module.Spotlight).toBeDefined();
    });

    it('should import Meteors component', async () => {
        const module = await import('@/components/ui/meteors');
        expect(module.Meteors).toBeDefined();
    });

    it('should import Label component', async () => {
        const module = await import('@/components/ui/label');
        expect(module.Label).toBeDefined();
    });

    it('should import Input component', async () => {
        const module = await import('@/components/ui/input');
        expect(module.Input).toBeDefined();
    });
});
