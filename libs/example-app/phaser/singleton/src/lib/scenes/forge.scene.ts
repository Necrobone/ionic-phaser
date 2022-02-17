/* eslint-disable no-magic-numbers */
import { Blacksmith, Sword } from '@company-name/shared/data-access-model';
import { CheapSword } from 'libs/shared/data-access-model/src/lib/sword/cheap_sword.class';
import { FancySword } from 'libs/shared/data-access-model/src/lib/sword/fancy_sword.class';
import * as Phaser from 'phaser';

import { ScrollManager } from '../utilities/scroll-manager';

export class ForgeScene extends Phaser.Scene {
    private backgroundKey = 'background-image'; // * Store the background image name
    private backgroundImageAsset = 'assets/blacksmith_bg.png'; // * Asset url relative to the app itself
    private backgroundImage: Phaser.GameObjects.Image; // * Reference for the background image
    private blackSmith: Blacksmith; // * We only have a single blacksmith in this game
    private scrollManager: ScrollManager; // * Custom openforge utility for handling scroll
    public constructedSwords: Sword[] = [];

    constructor() {
        super({ key: 'preloader' });
    }

    async preload() {
        try {
            console.log('forge.scene.ts', 'Preloading Assets...');
            // * First, set the base URL since we're just loading from the main application's asset folder
            this.load.setBaseURL('http://localhost:4200/');

            // * Now load the background image
            this.load.image(this.backgroundKey, this.backgroundImageAsset);
            // * Now preload the sword images, even though we don't use it initially
            this.load.image(FancySword.fancySwordKey, FancySword.fancySwordImageAsset);
            this.load.image(CheapSword.cheapSwordKey, CheapSword.cheapSwordImageAsset);
            // * Load the blacksmith sprites
            await this.preloadBlacksmithCharacter();
        } catch (e) {
            console.error('preloader.scene.ts', 'error preloading', e);
        }
    }

    /**
     * * Load the blacksmith sprites
     */
    preloadBlacksmithCharacter() {
        this.load.atlas(Blacksmith.blacksmithIdleKey, Blacksmith.blacksmithSpriteSheet, Blacksmith.blacksmithAtlas);
        this.load.atlas(Blacksmith.blacksmithHammeringKey, Blacksmith.blacksmithSpriteSheet, Blacksmith.blacksmithAtlas);
        this.load.animation(this.backgroundKey, Blacksmith.blacksmithAnimation);
    }

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create() {
        console.log('forge.scene.ts', 'Creating Assets...', this.scale.width, this.scale.height);

        // * Setup the Background Image
        this.backgroundImage = this.add.image(0, 0, this.backgroundKey);

        // * Setup the Blacksmith Character Sprite
        this.blackSmith = await Blacksmith.build(this);
        // * Because the blacksmith is a much smaller scale image than the background image, we need to scale it up.
        this.blackSmith.setScale(3);

        // * Now handle scrolling
        this.cameras.main.setBackgroundColor('0xEBF0F3');

        // * Register our custom scroll manager
        this.scrollManager = new ScrollManager(this);
        this.scrollManager.registerScrollingBackground(this.backgroundImage);
        // * Set cameras to the correct position
        this.cameras.main.setZoom(0.25);
        this.scrollManager.scrollToCenter();

        this.scale.on('resize', this.resize, this);
    }

    /**
     * * When the screen is resized, we
     *
     * @param gameSize
     */
    resize(gameSize: Phaser.Structs.Size) {
        console.log('Resizing', gameSize.width, gameSize.height);
        this.cameras.resize(gameSize.width, gameSize.height);
    }
}
