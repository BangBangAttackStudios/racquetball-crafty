/*
 * Racquetball
 * (C) 2014, Bang Bang Attack Studios
 * http://www.bangbangattackstudios.com
*/
var Racquetball = (function() {
    var ns = {};
    
    Crafty.init(320, 480, document.getElementById('game'));
    Crafty.canvas.init();
    Crafty.background('#303030');
    
    Crafty.scene('Loading', function() {
        // load resources
        var resources = [
            'img/ball.png',
            'img/racquet.png',
            'img/play.png',
            'img/pause.png',
            'img/splash-bg.png',
            'img/splash-logo.png',
            'img/speaker-on2.png',
            'img/speaker-off2.png',
            
            'sfx/bounce.ogg','sfx/bounce.mp3','sfx/bounce.wav',
            'sfx/bounce2.ogg','sfx/bounce2.mp3','sfx/bounce2.wav',
            'sfx/lose.ogg','sfx/lose.mp3','sfx/lose.wav',
            'sfx/win.ogg','sfx/win.mp3','sfx/win.wav',
            
            'bgm/track1.mp3','bgm/track1.ogg','bgm/track1.wav'
        ];
        
        function onLoad() {
            
            Crafty.audio.add({
                bgm: ['bgm/track1.mp3','bgm/track1.ogg','bgm/track1.wav'],
                bounce: ['sfx/bounce.ogg','sfx/bounce.mp3','sfx/bounce.wav'],
                bounce2: ['sfx/bounce2.ogg','sfx/bounce2.mp3','sfx/bounce2.wav'],
                win: ['sfx/win.ogg','sfx/win.mp3','sfx/win.wav'],
                lose: ['sfx/lose.ogg','sfx/lose.mp3','sfx/lose.wav']
            });
            
            // to splash scene
            Crafty.scene('Splash');
            
            
        }
        
        function onProgress(p) {
            // p is { loaded: j, total: total, percent: (j / total * 100) ,src:src})
            console.log('loading ' + p.src + ' [' + p.percent + '%]');
        }
        
        function onError(e) {
            console.log('failed to load asset ' + e);
        }
        
        Crafty.load(resources, onLoad, onProgress, onError);
        
    });
    
    Crafty.scene('Splash', function() {
        
        var skipped = false;
        
        Crafty.e("2D, DOM, Image").image("img/splash-bg.png");
        
        Crafty.e("2D, DOM, Image, Tween").image("img/splash-logo.png")
        .attr({alpha: 0.0, x: 10, y: -129 })
        .tween({alpha: 1.0, y: 240-67 }, 1500);
        
        Crafty.e('Delay').delay(function() {
            if (!skipped) {
                Crafty.scene('Title');
                
            }
        }, 3000, 0);
        
        Crafty.e('2D, DOM, Color, Mouse')
        .color('black')
        .attr({x: 0, y: 0, w: 320, h: 480, alpha: 0.0 })
        .bind('Click', function() {
            skipped = true;
            Crafty.scene('Title');
        });
    });
    
    Crafty.scene('Title', function() {
        
        Crafty.e('2D, Canvas, Text')
        .attr({x: 10, y: 24})
        .textColor('#ffffff')
        .textFont({size: '56px', family: 'Helvetica' })
        .text('Racquetball');
        
        Crafty.e('2D, Canvas, Text, Mouse')
        .attr({x: 104, y: 224})
        .textColor('#ffffff')
        .textFont({size: '34px', family: 'Helvetica' })
        .text('START')
        .bind('Click', function() {
            Crafty.scene('Court');
            Crafty.audio.play('bgm', -1);
        });
        
        Crafty.e('2D, Canvas, Text, Mouse')
        .attr({x: 84, y: 424})
        .textColor('#ffffff')
        .textFont({size: '34px', family: 'Helvetica' })
        .text('CREDITS')
        .bind('Click', function() {
            Crafty.scene('Credits');
        });
        
    });
    
    Crafty.scene('Credits', function() {
        Crafty.e('2D, Canvas, Text')
        .attr({x: 10, y: 224})
        .textColor('#ffffff')
        .textFont({size: '24px', family: 'Helvetica' })
        .text('Developed by Richard Marks');
        
        Crafty.e('2D, DOM, Color, Mouse')
        .color('black')
        .attr({x: 0, y: 0, w: 320, h: 480, alpha: 0.0 })
        .bind('Click', function() {
            Crafty.scene('Title');
        });
        
    });
    
    Crafty.c('Edges', {
        init: function() {
            var t = this;
            Object.defineProperties(t, {
                left:    { get: function() { return t.x; } },
                right:   { get: function() { return t.x + t.w; } },
                top:     { get: function() { return t.y; } },
                bottom:  { get: function() { return t.y + t.h; } },
                centerX: { get: function() { return t.x + t.w / 2; } },
                centerY: { get: function() { return t.y + t.h / 2; } },
                center:  { get: function() { return { x: t.centerX, y: t.centerY }; } }
            });
        }
    });
    
    Crafty.c('Racquet', {
        _held: false,
        _hitbox: { x: 160 - 48, y: 480 - (48 + 52), w: 96, h: 32 },
        _bounds: { x: { l: 0, h: 320 }, y: { l: 0, h: 480 } },
        init: function() {
            this.requires('2D, Canvas, Image, Mouse, Edges');
            this.image('img/racquet.png')
            .bind('MouseDown', function() { this._held = true; })
            .bind('MouseUp', function() { this._held = false; })
            .bind('MouseMove', function(e) {
                var t = this;
                if (!t._held) {
                    return;
                }
                
                t._hitbox.x = e.realX - (t._hitbox.w / 2);
                
                if (t._hitbox.x < t._bounds.x.l) {
                    t._hitbox.x = t._bounds.x.l;
                } else if (t._hitbox.x > t._bounds.x.h - t._hitbox.w) {
                    t._hitbox.x = t._bounds.x.h - t._hitbox.w;
                }
                
                t.attr({ x: t._hitbox.x }).trigger('Moved', { x: this._x, y: this._y });
                
            })
            .attr({ x: this._hitbox.x, y: this._hitbox.y, width: this._hitbox.w, height: this._hitbox.h });
        }
    });
    
    Crafty.c('Ball', {
        _locked: false,
        _hitbox: { x: 160 - 48, y: 480 - (48 + 52), w: 96, h: 32 },
        _bounds: { x: { l: 0, h: 320 }, y: { l: 0, h: 480 } },
        _vel: { x: 1.0, y: -1.0 },
        _speed: 14.0,
        _aorb: true,
        _prevPos: { x: 0, y: 0 },
        init: function() {
            this.requires('2D, Canvas, Image, Collision, Edges');
            this.image('img/ball.png')
            .attr({ x: 160, y: 120, width: 16, height: 16 })
            .bind('EnterFrame', this._onEnterFrame);
            
            this._hitbox.x.l += 8;
            this._hitbox.x.h -= 8;
            this._hitbox.y.l += 8;
            this._hitbox.y.h -= 8;
        },
        
        reset: function() {
            var t = this;
            t.attr({ x: 160, y: 120 });
            t._vel.x = 1.0;
            t._vel.y = -1.0;
            t._speed = 14.0;
            t._locked = false;
        },
        
        _onEnterFrame: function() {
            var t = this, dt = 0.33;
            if (t._locked) {
                return;
            }
            
            t._aorb = !t._aorb;
            
            t._prevPos.x = t.x;
            t._prevPos.y = t.y;
            
            t.x += t._vel.x * t._speed * dt;
            t.y += t._vel.y * t._speed * dt;
            
            t._checkLostBall();
            t._checkWallCollisions();
            t._checkPaddleCollision();
        },
        
        _playBounceSfx: function() {
            Crafty.audio.play(this._aorb ? 'bounce' : 'bounce2');
        },
        
        _playScoreSfx: function() {
            Crafty.audio.play('win');
        },
        
        _playLostSfx: function() {
            Crafty.audio.play('lose');
        },
        
        _speedUp: function() {
            var t = this;
            t._speed += 0.8;
            if (t._speed > 60) {
                t._speed = 60;
            }
        },
        
        _checkLostBall: function() {
            var t = this;
            if (t.y < t._bounds.y.h) {
                return;
            }
            
            t._playLostSfx();
            t.destroy();
            t._locked = true;
            
            setTimeout(function() {
                Crafty.trigger('BallLost');
            }, 1000);
        },
        
        _checkWallCollisions: function() {
            var t = this;
            
            if (t.x < t._bounds.x.l || t.x > t._bounds.x.h) {
                t.x = t._prevPos.x;
                t._vel.x *= -1;
                t._playBounceSfx();
            }
            
            if (t.y < t._bounds.y.l) {
                t._playScoreSfx();
                t._speedUp();
                t.y = t._prevPos.y;
                t._vel.y *= -1;
            }
        },
        
        _checkPaddleCollision: function() {
            var t = this;
            if (t._vel.y < 0) {
                return;
            }
            
            var hit = t.hit('Racquet')[0];
            
            if (hit) {
                t._playBounceSfx();
                t._speedUp();
                t._vel.y *= -1;
                t._vel.x = t._calculateBounceVelocity(hit.obj);
            }
        },
        
        _calculateBounceVelocity: function(subject) {
            var t = this,
                dist = Crafty.math.distance(subject.centerX, subject.centerY, t.centerX, t.centerY);
            
            var magnitude = dist - ((t.h - subject.h) * 0.5);
            var ratio = magnitude / (subject.w / 2) * 2.5;
            if (t.centerX < subject.centerX) {
                ratio = -ratio;
            }
            return ratio;
        }
    });
    
    Crafty.scene('Court', function() {
        /*
        var fieldBounds = { x: { l: 0, h: 320 }, y: { l: 0, h: 432 } },
            score = 0,
            racquet = null,
            ball = null,
            scoreDisplay = null,
            muteButton = null,
            pauseButton = null;
        
        scoreDisplay = Crafty.e('ScoreDisplay');
        ball = Crafty.e('Ball');
        racquet = Crafty.e('Racquet');
        muteButton = Crafty.e('MuteButton');
        pauseButton = Crafty.e('PauseButton');
        
        Crafty.bind('BallLost', function() {
            Crafty.audio.stop();
            Crafty.trigger('MessageEvent', 'You Lose!');
            Crafty.scene('Message');
        });
        */
        
        // REFACTORING
        
        // entities
        // -ball
        // -racquet
        // -score display
        // -mute button
        // -pause button
        // -message display
        // -blackbox
        
        // ball bounces off racquet and left, top, and right walls
        // ball is destroyed when it passes racquet, and score when hitting top wall
        // racquet moves left and right
        // mute button toggles audio playback
        // pause button halts ball and racquet and displays  'paused' in the message display
        // blackbox is used to fade in and fade out the court scene
        
        // events
        // -court_loading - triggered immediately when the Court scene is started
        // -court_ready - triggered after court_loading fade completes
        // -court_closing - triggered after message is closed
        // -ball_scored - triggered when ball hits top wall
        // -ball_lost - triggered when ball leaves bottom edge of screen
        
        // components
        // -actor
        //  provides place(), reset(), show(), activate() functions
        // -blackbox
        //  provides cover(), uncover(), fadeOut(), fadeIn() functions
        // -display
        //  provides display(), modal() functions
        
        Crafty.c('blackbox', {
            init: function() {
                this.requires('2D, DOM, Color, Tween')
                .attr({ x: 0, y: 0, w: 320, h: 480, alpha: 1.0 })
                .color('#000000');
            },
            cover: function() {
                this.attr({ alpha: 1.0 });
                return this;
            },
            uncover: function() {
                this.attr({ alpha: 0.0 });
                return this;
            },
            fadeOut: function(duration) {
                this.tween({alpha: 0.0 }, duration);
                return this;
            },
            fadeIn: function(duration) {
                this.tween({alpha: 1.0 }, duration);
                return this;
            }
        });
        
        Crafty.c('actor', {
            _startX: 0,
            _startY: 0,
            _activated: false,
            init: function() {
                this.requires('2D, Canvas');
            },
            place: function(x, y) {
                this._startX = x;
                this._startY = y;
                this.x = x;
                this.y = y;
                return this;
            },
            reset: function() {
                this.x = this._startX;
                this.y = this._startY;
                return this;
            },
            show: function() {
                this.attr({ alpha: 1.0 });
                return this;
            },
            activate: function() {
                this._activated = true;
                return this;
            }
        });
        
        Crafty.c('display', {
            init: function() {
                this.requires('2D, DOM, Text');
            },
            display: function(what) {
                this.textColor('#ffffff')
                .textFont({size: '36px', family: 'Helvetica' })
		.text(what)
		.css('text-align', 'center');
                return this;
            },
            modal: function() {
                var t = this;
                Crafty.e('2D, DOM, Mouse, modal')
                .attr({
                    x: 0,
                    y: 0,
                    w: Crafty.stage.elem.clientWidth,
                    h: Crafty.stage.elem.clientHeight
                })
                .bind('Click', function() {
                    t.trigger('dismiss');
                    this.destroy();
                });
                return this;
            }
        });
        
        Crafty.c('racquet', {
            init: function() {
                this.requires('Image');
            },
        });
        
        var blackbox = Crafty.e('blackbox').uncover();
        
        var racquet = Crafty.e('actor, racquet').place();
        var ball = Crafty.e('actor, ball').place();
        
        var scoreDisplay = Crafty.e('display');
        
        Crafty.bind('court_loading', function() {
            blackbox.cover().fadeOut(1500).bind('TweenEnd', function() {
                racquet.reset().show();
                ball.reset().show();
                score = 0;
                scoreDisplay.display(score);
                Crafty.trigger('court_ready');
            });
        });
        
        Crafty.bind('court_ready', function() {
            setTimeout(function() {
                racquet.activate();
                ball.activate();
            }, 1000);
        });
        
        Crafty.bind('court_closing', function() {
            blackbox.uncover().fadeIn(1500).bind('TweenEnd', function() {
                Crafty.scene('Title');
            });
        });
        
        Crafty.bind('ball_scored', function() {
            score++;
            scoreDisplay.display(score);
            if (score >= 15) {
                message.display('You Win!').modal().bind('dismiss', function() {
                    Crafty.trigger('court_closing');
                });
            }
        });
        
        Crafty.bind('ball_lost', function() {
            message.display('You Lose!').modal().bind('dismiss', function() {
                Crafty.trigger('court_closing');
            });
        });
        
        // the court scene actually starts here
        Crafty.trigger('court_loading');
        
    }, function() {
        // remove global event bindings when the court scene exits
        Crafty.unbind('court_loading');
        Crafty.unbind('court_ready');
        Crafty.unbind('court_closing');
        Crafty.unbind('ball_scored');
        Crafty.unbind('ball_lost');
        
        // stop audio playback
        Crafty.audio.stop();
    });
    
    
    
    
    
    
    
    Crafty.scene('Message', function() {
        Crafty.bind('MessageEvent', function(msg) {
            Crafty.e('2D, Canvas, Text')
            .attr({x: 10, y: 24})
            .textColor('#ffffff')
            .textFont({size: '56px', family: 'Helvetica' })
            .text(msg);
        });
        
        Crafty.e('2D, DOM, Color, Mouse')
        .color('black')
        .attr({x: 0, y: 0, w: 320, h: 480, alpha: 0.0 })
        .bind('Click', function() {
            Crafty.scene('Title');
        });
    });
    
    Crafty.scene('Loading');
    
    return {
        VERSION: '1.0',
        COPYRIGHT: '(C) 2014, Bang Bang Attack Studios',
        WEBSITE: 'http://www.bangbangattackstudios.com',
        DEVELOPER: 'Richard Marks of Bang Bang Attack Studios'
    };
})();