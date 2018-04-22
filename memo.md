# Angularデベロッパーズガイド備忘録

## 特徴

* フルスタック
    + データバインディング
    + フォームバリデーション
    + 非同期通信
    + ルーティング
    + テスト
        - Karma
        - Protractor
    + アニメーション
        - Web Animations APIベース
    + ally
    + セキュリティ？
        - TODO
    + クロスプラットフォーム
        - PWA
        - モバイルネイティブ
        - デスクトップ
    + SSR(Universal)
    + CLI
* パフォーマンス
* コンポーネント指向
* TypeScript
* Semver
* リリースサイクル(9月, 3月)
* 破壊的変更があるAPIはDeprecated→Dispose


## コンポーネント指向

* Web Components, Shadow DOM
* コンポーネントツリー

## テンプレート構文

* Mustache
* (event)="handler($event)"
* [prop]="bindable"
* [attr.hoge]="bindable"
    + HTML属性にあってDOMプロパティには無い物が存在するため（例えばcolspan）
* [class.hoge]="isHoge"
* [style.foo]="foo"
    + [style.font-size.%]="10" とか単位まで指定できる

## コンポーネント

* `ng g component hoge`
* `src/app/app.module.ts` `@NgModule({declarations:[...Hoge.Component]})`
* @Componentデコレータ(@Directiveを継承している)
* ライフサイクル
    + あとで追記する

## ディレクティブ

* `ng g directive hoge`
* コンポーネントでimport

## コンポーネント・ディレクティブのメタデータ

```ts
@Component({
    selector: '.my-app[data-component]',  // マウント先, :notとか, [visible=false]とか指定できる CSSセレクタほど柔軟ではない
    host: { '[class.red]': 'isRed' }, // 使わない。@HostBindig, @HostListenerを使う
    inputs: ['prop'],  // 使わない。@Inputデコレータが推奨される
    output: ['changeHoge'],  // 使わない。@Outputを使う
    exportAs: 'hoge',  // 親コンポーネントで <app-child #c="hoge"> とできる
    template: '<p>{{prop}}</p> <button (click)="changeHogeをEmitする関数()">ボタン</button>',
    providers: [{provide: HogeService, useClass: MockHogeService}],  // コンストラクタでHogeService型の引数があればMockHogeServiceがDIされる
    viewProviders: [{provide: HogeService, useClass: MockHogeChildService}],  // viewChild(ネストした子コンポーネントにはMockHogeChildServiceがDIされる)
    changeDetection: ChangeDetectionStrategy.OnPush,  // Inputに変更があった時だけ変更検知
    // viewChild, viewChildren, contentChild, contentChildrenは使わない、各デコレータを使う
    // parentComponentの初期化時にchildComponentは初期化されていないのでAfterViewInitフックを使う
    encapsulation: ViewEncapsulation.Emulated,  // ローカルスコープを属性セレクタか、ShadowDOMで実現するか
})
```

## その他デコレータ

```ts
@Input('counter') cnt: number;  // 別名を付けられる
@Output('outCounter') cnt = new EventEmitter();

@Input()
set count(cnt: num) { ... }  // 単純なバインド以外も出来る
get count() { ... }

@HostBinding('class.red') isRed = false;  // isRedがtrueなら class.red を付与
@HostListener('click', ['$event']) onClick(ev) { ... }  // コンポーネントのclickイベントにバインド
```


## アニメーション

* 特殊なstate
    + `void` コンポーネントにアニメーション要素が存在していない状態
        - ngIfでfalseと評価されている状態
    + `*` 存在しているが何も設定されていない状態
* 特殊なtransition
    + `:enter` void => *
    + `:leave` * => void
    + `:increment, :decrement` stateではなくトリガーにバインドされた数値の増減が条件になる

```ts
@Component([{
    animations: [trigger('myTrigger', [
        state('on', style({'opacity': 1})),
        state('off', style({'opacity': 0})),
        transition('on => off', [ animate('.5s 100ms ease-in') ]),  // 持続時間、開始遅延時間
        style({height: 0}),  // トランジションの影響を受けず、一瞬でこのスタイルに変わる。**'*'というワイルドカードもある**
    ]],
}])

animate('1s', style({opacity: 1}))  // stateを使わずにanimateだけでアニメーション可能
animate('1s', keyframes([
    style({}), style({}), style({})  // 全て等間隔。不均等にする場合は各styleにoffsetプロパティを0.0-1.0で記述
]))
sequence([
    group([
        animate(...), animate(....)  // 2つのアニメーションは同時再生
    ]),
    animate(...)  // 上記2つのアニメーション後再生
])
query(':self', [  // コンポーネント自身を対象
    style(...),
    animate(...)
])
query('.contents', [ ... ], {limit:1})  // 子要素の.contentsを対象(最初に見つかった1要素のみ)

query(':enter',[
    style(...),
    stagger(100, animate('500ms', style(...)))  // 500ms「ずつ」ずれて再生
])

query('@anotherTrigger', [animateChild()])  // 別トリガーのアニメを再生

const externalAnimation = animation([animate(...)]);
useAnimation(externalAnimation)
```

## サービスとDI

* `ng g service hoge`
* コンポーネントでimport
* モジュールのprovidersに追加
* DIによって取得するインスタンスは**シングルトン**

```ts
{provide: HogeService, useClass: HogeService},  // 明示しない場合は暗黙的にコレに変換される
{provide: HogeService, useValue: hogeServiceValue},  // exportされたインスタンスをDI（クラスをインスタンス化したもの）
[HogeService, {provide: FooService, useExisting: HogeService}],  // FooServiceをHogeServiceの別名として使う
{provide: HogeFactoryService, useFactory: hogeFactory, deps: [HogeService, FooService]},  // 関数をDIできる。その関数にもdepsをDIできる

{provide: HogeConstToken, useValue: HOGE_CONST},  //  exportされたインスタンスをDI（雑なconstハッシュ）
interface HogeConst { id: number, name: string }
export const HOGE_CONST: HogeConst = { id: 1, name: 'hoge' };
export const HogeConstToken = new InjectionToken<HogeConst>('hogeconsttoken')
```

```ts
constructor(private hoge: HogeService) {}  // 暗黙的
constructor(@Inject(HogeService) private hoge: HogeService) {}  // 明示

constructor(@Optional() private hoge: HogeService) {}  // providerがない場合nullが代入される
```


## コンポーネント間通信

* @Inputデコレータ
    + `<parent><child [childInputProp]="parentProp">`
* @Outputデコレータ
    + `<parent><child (childOutputProp)="parentMethod($event)"`
    + `@Output() childOutputProp = new EventEmitter();  ... childOutputProp.emit(hoge);`

## ビルトインディレクティブ

* ngClass
    + `[ngClass]="'hoge foo bar'"`
    + `[ngClass]="['hoge', 'foo', 'bar']"`
    + `[ngClass]="{'hoge': isHoge}"`
* ngStyle
    + `[ngStyle]="{ 'width': 100px }"`
    + `[ngStyle]="styleHoge"`
* *ngFor
    + `<li *ngFor="let e of elems; index as i; even as isEven; odd as isOdd; first as isFirst; last as isLast;"> {{i}}: {{e.prop}} </li>`
* *ngIf
    + `<p *ngIf="isVisible; else isElse">visible</p>`
    + `<ng-template #isElse><p>else case</p></ng-template>`
* ngSwitch, *ngSwitchCase, *ngSwitchDefault
    + `<div [ngSwitch]="case"> <div *ngSwitchCase="1">ほげ</div> <div *ngSwitchCase="2">ふー</div> <div *ngSwitchDefault>でふぉ</div>`

## パイプ

* uppercase
* date: 'yyyyMMdd'

## モジュール

* JIT `platformBrowserDynamic().bootstrapModule(AppModule)`
* @NgModule()デコレータ
    + imports 依存モジュール exportsされたコンポーネントなど、プロバイダなどが使用可能になる
    + declarations 依存コンポーネントなど
    + providers 依存サービスなど
    + exports 他のModuleに対してComponentなどを公開する
    + あとでしらべる
        - entryComponents: [] // Lazy loadingと関係？
* ComponentModule
* BrowserModule ∋ ComponentModule
* WorkerAppModule WebWorker用

## Typescript

* デコレータ
    + メタデータを渡す

## RxJS

* Observerはnext, error, completeのみ
* Observableはsubscribeのみ

```ts
// クリック回数をカウント
const click$ = Rx.Observable.fromEvent(btnHoge, 'click');
click$.throttleTime(1000).scan(count => count + 1, 0).subscribe(count => console.log(`${count} Clicked!`));

// ObserverとObservable
const observable = Rx.Observable.create(observer => {
    observer.next('A'); observer.next('B');
});
observable.subscribe({
    next: x => console.log(x),
    error: x => console.error(x),
    complete: () => console.log('complete')
})

// Subject は subscribe も next も出来る
const subject = new Rx.Subject();
subject.subscribe({next: console.log});
subject.next('A');
observable.subscribe(subject);  // 当然subscribeで他のobservableを購読できる

// PromiseとRxJS
const o = Rx.Observable.fromPromise(hogePromise);
const p = Rx.Observable.of('a').roPromise();

```
