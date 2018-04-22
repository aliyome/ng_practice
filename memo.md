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
    animations: [trigger('myTrigger', [
        state('on', style('opacity', 1)),
        state('off', style('opacity', 0)),
        transition('on => off', [ animate('.5s') ])
    ]],
    encapsulation: ViewEncapsulation.Emulated,  // ローカルスコープを属性セレクタか、ShadowDOMで実現するか
})
```

## サービス

* `ng g service hoge`
* コンポーネントでimport
* モジュールのprovidersに追加

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

## RxJx

* Observerはnext, error, completeのみ
* Observableはsubscribeのみ