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

## JSONP

```ts
// HttpClientModule, HttpClientJsonModuleを事前にimports
constructor(private http: HttpClient) {}
hoge() {
    this.http.jsonp('assets/data.jsonp', 'callback').subscribe(data => console.log(data));
}
```

## Http

```ts
const headers = new HttpHeaders();
const params = new HttpParams();
params.append('foo', 'buz');
headers.append('X-Api-Token', 'token');
const options = {params, headers};
// const options = { params: {...}, headers: {...} };  // HttpHeadersとか使わずにこれでもいい
this.http.get<string>('hoge.json', options).subscribe(console.log);
```

## パイプ

ビルトインパイプ

* number: '3.1-5' ⇒ 整数部が3桁以上、小数部は1桁から最大5桁
* percent: '3.1-5'
* currency: 'JPY': true: '3.1-5' ⇒ 通貨:通貨記号表示:number
* date: 'yyyyMMdd HHmmss'
* json ⇒ 文字列として表示
* slice: 0: 3 ⇒ 0-3要素のみ表示
* async ⇒ Observable, Promiseの結果を表示 (unsubscribeまでやってくれる)

カスタムパイプ

```ts
// declarationsに追加すると使える
@Pipe({ name: 'pipe-hoge' })
export class HogePipe implements PipeTransform {
    transform(value: any, arg1: any, arg2: any): any {
        return 1;
    }
}
```

## フォーム

* FormsModule : テンプレート駆動 定型的なものに
* ReactiveFormsModule : コード駆動 インタラクティブにフォームが変化するものに
    + 加えて、フォームのロジックが
* 状態を表すCSSクラスが提供される
    + ng-touched, ng-untouched
    + ng-dirty, ng-pristine  // 変更済み・変更なし
    + ng-valid, ng-invalid
* バリデーション
    + required
    + maxlength, minlength
    + pattern
    + email

```ts
export class HogeComponent {
    hoge = new FormControl();  // 1項目のみ
    group: FormGroup;  // 複数項目
    constructor(private fb: FormBuilder) {
        this.group = this.fb.group({
            name: ['default name', Validators.required],
            age: ['', Validators.required]
        });
    }
    // group.value には {name: 'default name', age: ''} が格納される。
}
```
```html
<input [formControl]="hoge">
<form [formGroup]="group" novalidate>
    <input formControlName="name">
    <input formControlName="age">
</form>
```

## ルーティング

CLIでプロジェクトを作る際、`ng new proj --routing`で基本的なルーティングが作成される

`ng g guard hoge` で基本的なガード（遷移時アクセス制御）が作れる

* <router-outlet></router-outlet>  // ここにコンポーネントが描画される
    + <router-outlet name="sub"></router-outlet>  // 復数のルーティング要素を配置可能
* <a routerLink="/">home</a>  // コンポーネント切り替えのリンク (pushState)
    + <a [routerLink]="['/', 'detail'">detail</a>  // 当然バインド出来る [routerLink]="/detail"と同じ
    + <a [routerLink]="['/', 'detail', item.id">item</a>  // 詳細ページへのリンク作成に便利 /detail/1
    + <a routerLink="/" routerLinkActive="active">home</a>  // 現在のURLと同じなら .active クラスが付与される
    + <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">home</a>  // 完全一致のみ
    + <a routerLink="/detail" [queryParams]="{hoge: 'foo'}">foo</a>  // クエリパラメータ ?hoge=foo を渡す
    + <a routerLink="/detail" fragment="bar">#bar</a>  // フラグメント #bar を渡す


```ts
const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',  // 前方一致ではなく完全一致
        canActivateChild: [HogeGuard],  // コンポーネント生成前チェック
        canDeactivate: [HogeGuard],  // ルーティングから外れるタイミング（編集中なのに別ページに遷移とか）
        children: [  // 多階層可能
            { path: '', component: HogeComponent, data: {title: 'トップページ'}},  // dataはroute.dataで取得可能
            { path: 'detail', component: DetailComponent, children: [
                { path: ':id', component: ChildComponent }  // URLパラメータ
            ]}
        ]
    },
    {
        path: 'sub',  // /subにアクセスしても何も表示されない。router-outlet name="sub" のみアクセス可能
        component: SubComponent,
        resolve: { hogeData: HogeResolverService },  // resolverサービスを作ることで動的にdataにデータを渡せる。
        outlet: 'sub'
    }
    {
        path: '**',
        redirectTo: ''  // ルートページへ
    }
];

@Component()
export class ChildComponent {
    constructor(private route: ActivatedRoute) {}
    hoge() {
        // URLパラメータ(:id)
        this.route.params.subscribe(x => console.log(x['id']));
        console.log(this.route.snapshot.params['id']);  // 同期版
        // クエリパラメータ(?以降)
        this.route.queryParams.subscribe(x => console.log(x));  // jsonライクオブジェクトで取得
        // フラグメント(#以降)
        this.route.fragment.subscribe(x => {
            // Angularはブラウザのページ遷移を使わないため、アンカーリンクが効かない。
            // アンカーリンクは自分で実装する
            const target = document.getElementById(x);
            if (target) target.scrollIntoView();
        });
        // URL変更
        const extras: NavigationExtras = { queryParams: {a:0, b:'hoge'} };  // その他のオプション：fragmentとかいろいろ
        // { skipLocationChange: true, replaceUrl: true }  // URLを変更しない、ブラウザに履歴を残さない　など。
        // { queryParamsHandling: 'merge' }  // クエリパラメータを引き継ぐ
        this.route.navigate(['/detail', 1], extras);  // 1は:id -> /detail/1
    }
}

@Injectable()
export class HogeGuard implements CanActivate,   // コンポーネント生成前
                                  CanActivateChild,  // childrenのルーティングに対するCanActivate
                                  CanDeactivate,   // ルーティングから外れてコンポーネントが吐きされるタイミング
                                  CanLoad 
                                  {
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (認証成功) {
            return true;
        } else {
            this.route.navigate(['/']);
        }
    }

    canDeactivate(
        component: HogeComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        return window.confirm('ページ遷移していい？');
    }
}

// Resolverは ng g service HogeResolverServiceでサービスとして作る
@Injectable()
export class HogeResolverService implements Resolve<string> {
    constructor(private router: Router) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise(resolve => {
            resolve('hoge');
        });
    }
}
```

