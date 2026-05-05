import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PRODUCTS } from '../data/products';
import type { Product, ProductId } from '../data/products';
import { Modal } from '../components/ui/Modal';

type ModalState =
  | { type: 'detail'; product: Product }
  | { type: 'contract_form'; product: Product }
  | { type: 'cancel_confirm'; product: Product }
  | null;

/* ── Per-product form state ─────────────────────────────────────── */

interface CuentaCorrienteForm {
  holder: string;
  startDate: string;
  accountType: 'standard' | 'premium' | 'youth';
  paperless: boolean;
  agreed: boolean;
}

interface TarjetaCreditoForm {
  holder: string;
  cardType: 'classic' | 'gold' | 'platinum';
  limit: number;
  contactless: boolean;
  notifications: boolean;
  agreed: boolean;
}

interface PlanAhorroForm {
  holder: string;
  startDate: string;
  monthlyAmount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  goal: string;
  reinvest: boolean;
  agreed: boolean;
}

interface SeguroVidaForm {
  holder: string;
  birthDate: string;
  coverage: '50000' | '100000' | '150000';
  extras: { disability: boolean; critical: boolean; repatriation: boolean };
  smoker: boolean;
  agreed: boolean;
}

type ProductForm =
  | { id: 'cuenta_corriente'; data: CuentaCorrienteForm }
  | { id: 'tarjeta_credito'; data: TarjetaCreditoForm }
  | { id: 'plan_ahorro'; data: PlanAhorroForm }
  | { id: 'seguro_vida'; data: SeguroVidaForm };

const DEFAULT_FORMS: Record<ProductId, ProductForm> = {
  cuenta_corriente: {
    id: 'cuenta_corriente',
    data: { holder: '', startDate: '', accountType: 'standard', paperless: false, agreed: false },
  },
  tarjeta_credito: {
    id: 'tarjeta_credito',
    data: { holder: '', cardType: 'classic', limit: 1500, contactless: true, notifications: false, agreed: false },
  },
  plan_ahorro: {
    id: 'plan_ahorro',
    data: { holder: '', startDate: '', monthlyAmount: 100, frequency: 'monthly', goal: '', reinvest: false, agreed: false },
  },
  seguro_vida: {
    id: 'seguro_vida',
    data: {
      holder: '', birthDate: '', coverage: '100000',
      extras: { disability: false, critical: false, repatriation: false },
      smoker: false, agreed: false,
    },
  },
};

function isFormValid(form: ProductForm): boolean {
  switch (form.id) {
    case 'cuenta_corriente':
      return form.data.holder.trim().length > 2 && !!form.data.startDate && form.data.agreed;
    case 'tarjeta_credito':
      return form.data.holder.trim().length > 2 && form.data.limit >= 500 && form.data.agreed;
    case 'plan_ahorro':
      return form.data.holder.trim().length > 2 && !!form.data.startDate && form.data.monthlyAmount >= 10 && form.data.agreed;
    case 'seguro_vida':
      return form.data.holder.trim().length > 2 && !!form.data.birthDate && form.data.agreed;
  }
}

/* ── Component ─────────────────────────────────────────────────── */

export function ProductsPage(): React.ReactElement {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [modal, setModal] = useState<ModalState>(null);
  const [formStep, setFormStep] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [form, setForm] = useState<ProductForm>(DEFAULT_FORMS.cuenta_corriente);

  const close = () => {
    setModal(null);
    setFormStep('idle');
  };

  const openDetail = (product: Product) => setModal({ type: 'detail', product });

  const handleContract = () => {
    if (modal?.type !== 'detail') return;
    setForm({ ...DEFAULT_FORMS[modal.product.id] } as ProductForm);
    setModal({ type: 'contract_form', product: modal.product });
  };

  const handleCancel = () => {
    if (modal?.type !== 'detail') return;
    setModal({ type: 'cancel_confirm', product: modal.product });
  };

  const submitContract = () => {
    if (modal?.type !== 'contract_form') return;
    setFormStep('submitting');
    setTimeout(() => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === modal.product.id
            ? { ...p, contracted: true, contractedSince: new Date().toISOString().slice(0, 10) }
            : p
        )
      );
      setFormStep('done');
    }, 800);
  };

  const confirmCancel = () => {
    if (modal?.type !== 'cancel_confirm') return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === modal.product.id ? { ...p, contracted: false, contractedSince: undefined } : p
      )
    );
    close();
  };

  return (
    <>
      <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <div className="page-header-meta">Bank MockUp</div>
          <h2 className="page-header-title">{t('products.title')}</h2>
        </div>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <button
            key={product.id}
            className="product-card"
            onClick={() => openDetail(product)}
          >
            <div className="product-card-icon">
              {PRODUCT_ICONS[product.id]}
            </div>
            <div className="product-card-body">
              <div className="product-card-name">{t(`products.${product.id}.name`)}</div>
              <div className="product-card-desc">{t(`products.${product.id}.tagline`)}</div>
            </div>
            <div className={`product-card-status ${product.contracted ? 'contracted' : 'available'}`}>
              {product.contracted ? t('products.contracted') : t('products.available')}
            </div>
          </button>
        ))}
      </div>

      {/* ── Detail modal ── */}
      {modal?.type === 'detail' && (
        <Modal title={t(`products.${modal.product.id}.name`)} onClose={close}>
          <div className="product-detail">
            <div className="product-detail-icon">{PRODUCT_ICONS[modal.product.id]}</div>
            <p className="product-detail-desc">{t(`products.${modal.product.id}.description`)}</p>

            <div className="product-detail-features">
              {(t(`products.${modal.product.id}.features`, { returnObjects: true }) as string[]).map((f) => (
                <div key={f} className="product-detail-feature">
                  <span className="product-feature-dot" />
                  {f}
                </div>
              ))}
            </div>

            {modal.product.contracted && modal.product.contractedSince && (
              <div className="product-detail-since">
                {t('products.contractedSince', { date: modal.product.contractedSince })}
              </div>
            )}

            <div className="modal-footer" style={{ marginTop: 'var(--space-6)' }}>
              {modal.product.contracted ? (
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleCancel}>
                  {t('products.cancelProduct')}
                </button>
              ) : (
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleContract}>
                  {t('products.contractProduct')}
                </button>
              )}
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={close}>
                {t('common.close')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Contract form modal ── */}
      {modal?.type === 'contract_form' && (
        <Modal title={t('products.contractForm.title')} onClose={close}>
          {formStep === 'done' ? (
            <div className="product-form-success">
              <div className="product-form-success-icon">✓</div>
              <p>{t('products.contractForm.success')}</p>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }} onClick={close}>
                {t('common.close')}
              </button>
            </div>
          ) : (
            <>
              <div className="product-form-subtitle">{t(`products.${modal.product.id}.name`)}</div>
              <ContractForm productId={modal.product.id} form={form} onChange={setForm} disabled={formStep === 'submitting'} />
              <div className="modal-footer">
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={close} disabled={formStep === 'submitting'}>
                  {t('common.cancel')}
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={submitContract}
                  disabled={!isFormValid(form) || formStep === 'submitting'}
                >
                  {formStep === 'submitting' ? t('products.contractForm.submitting') : t('products.contractForm.submit')}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* ── Cancel confirm modal ── */}
      {modal?.type === 'cancel_confirm' && (
        <Modal title={t('products.cancelConfirm.title')} onClose={close}>
          <p className="product-cancel-text">
            {t('products.cancelConfirm.body', { name: t(`products.${modal.product.id}.name`) })}
          </p>
          <div className="modal-footer">
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={close}>
              {t('common.cancel')}
            </button>
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={confirmCancel}>
              {t('products.cancelConfirm.confirm')}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

/* ── Per-product forms ──────────────────────────────────────────── */

interface FormProps {
  productId: ProductId;
  form: ProductForm;
  onChange: (f: ProductForm) => void;
  disabled: boolean;
}

function ContractForm({ productId, form, onChange, disabled }: FormProps): React.ReactElement {
  const { t } = useTranslation();

  if (productId === 'cuenta_corriente' && form.id === 'cuenta_corriente') {
    const d = form.data;
    const set = (patch: Partial<CuentaCorrienteForm>) =>
      onChange({ id: 'cuenta_corriente', data: { ...d, ...patch } });

    return (
      <div className="pf-fields">
        {/* Text input */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.holder')}</label>
          <input
            data-testid="field-holder"
            className="input"
            placeholder={t('products.contractForm.holderPlaceholder')}
            value={d.holder}
            onChange={(e) => set({ holder: e.target.value })}
            disabled={disabled}
          />
        </div>

        {/* Date picker */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.startDate')}</label>
          <input
            data-testid="field-start-date"
            className="input"
            type="date"
            value={d.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
            disabled={disabled}
          />
        </div>

        {/* Radio group */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.accountType')}</label>
          <div className="pf-radio-group">
            {(['standard', 'premium', 'youth'] as const).map((v) => (
              <label key={v} className="pf-radio">
                <input
                  data-testid={`radio-account-type-${v}`}
                  type="radio"
                  name="accountType"
                  value={v}
                  checked={d.accountType === v}
                  onChange={() => set({ accountType: v })}
                  disabled={disabled}
                />
                {t(`products.contractForm.accountTypes.${v}`)}
              </label>
            ))}
          </div>
        </div>

        {/* Toggle switch */}
        <label className="pf-toggle">
          <span className="input-label" style={{ marginBottom: 0 }}>{t('products.contractForm.paperless')}</span>
          <div className="pf-toggle-track">
            <input
              data-testid="toggle-paperless"
              type="checkbox"
              role="switch"
              checked={d.paperless}
              onChange={(e) => set({ paperless: e.target.checked })}
              disabled={disabled}
            />
            <div className="pf-toggle-thumb" />
          </div>
        </label>

        {/* Checkbox terms */}
        <label className="product-form-check">
          <input
            data-testid="checkbox-agreed"
            type="checkbox"
            checked={d.agreed}
            onChange={(e) => set({ agreed: e.target.checked })}
            disabled={disabled}
          />
          <span>{t('products.contractForm.terms')}</span>
        </label>
      </div>
    );
  }

  if (productId === 'tarjeta_credito' && form.id === 'tarjeta_credito') {
    const d = form.data;
    const set = (patch: Partial<TarjetaCreditoForm>) =>
      onChange({ id: 'tarjeta_credito', data: { ...d, ...patch } });

    return (
      <div className="pf-fields">
        {/* Text input */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.holder')}</label>
          <input
            data-testid="field-holder"
            className="input"
            placeholder={t('products.contractForm.holderPlaceholder')}
            value={d.holder}
            onChange={(e) => set({ holder: e.target.value })}
            disabled={disabled}
          />
        </div>

        {/* Select / Dropdown */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.cardType')}</label>
          <select
            data-testid="select-card-type"
            className="input"
            value={d.cardType}
            onChange={(e) => set({ cardType: e.target.value as TarjetaCreditoForm['cardType'] })}
            disabled={disabled}
          >
            <option value="classic">Classic</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        {/* Range slider */}
        <div className="input-group">
          <label className="input-label">
            {t('products.contractForm.creditLimit')}
            <span className="pf-range-value">{d.limit.toLocaleString('es')} €</span>
          </label>
          <input
            data-testid="range-limit"
            type="range"
            className="pf-range"
            min={500}
            max={6000}
            step={500}
            value={d.limit}
            onChange={(e) => set({ limit: Number(e.target.value) })}
            disabled={disabled}
          />
          <div className="pf-range-labels"><span>500 €</span><span>6.000 €</span></div>
        </div>

        {/* Toggle: contactless */}
        <label className="pf-toggle">
          <span className="input-label" style={{ marginBottom: 0 }}>{t('products.contractForm.contactless')}</span>
          <div className="pf-toggle-track">
            <input
              data-testid="toggle-contactless"
              type="checkbox"
              role="switch"
              checked={d.contactless}
              onChange={(e) => set({ contactless: e.target.checked })}
              disabled={disabled}
            />
            <div className="pf-toggle-thumb" />
          </div>
        </label>

        {/* Toggle: notifications */}
        <label className="pf-toggle">
          <span className="input-label" style={{ marginBottom: 0 }}>{t('products.contractForm.notifications')}</span>
          <div className="pf-toggle-track">
            <input
              data-testid="toggle-notifications"
              type="checkbox"
              role="switch"
              checked={d.notifications}
              onChange={(e) => set({ notifications: e.target.checked })}
              disabled={disabled}
            />
            <div className="pf-toggle-thumb" />
          </div>
        </label>

        {/* Checkbox terms */}
        <label className="product-form-check">
          <input
            data-testid="checkbox-agreed"
            type="checkbox"
            checked={d.agreed}
            onChange={(e) => set({ agreed: e.target.checked })}
            disabled={disabled}
          />
          <span>{t('products.contractForm.terms')}</span>
        </label>
      </div>
    );
  }

  if (productId === 'plan_ahorro' && form.id === 'plan_ahorro') {
    const d = form.data;
    const set = (patch: Partial<PlanAhorroForm>) =>
      onChange({ id: 'plan_ahorro', data: { ...d, ...patch } });

    return (
      <div className="pf-fields">
        {/* Text input */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.holder')}</label>
          <input
            data-testid="field-holder"
            className="input"
            placeholder={t('products.contractForm.holderPlaceholder')}
            value={d.holder}
            onChange={(e) => set({ holder: e.target.value })}
            disabled={disabled}
          />
        </div>

        {/* Date picker */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.startDate')}</label>
          <input
            data-testid="field-start-date"
            className="input"
            type="date"
            value={d.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
            disabled={disabled}
          />
        </div>

        {/* Number stepper */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.monthlyAmount')}</label>
          <div className="pf-stepper">
            <button
              data-testid="stepper-minus"
              type="button"
              className="pf-stepper-btn"
              onClick={() => set({ monthlyAmount: Math.max(10, d.monthlyAmount - 50) })}
              disabled={disabled || d.monthlyAmount <= 10}
            >−</button>
            <input
              data-testid="stepper-input"
              className="input pf-stepper-input"
              type="number"
              min={10}
              max={5000}
              value={d.monthlyAmount}
              onChange={(e) => set({ monthlyAmount: Math.max(10, Number(e.target.value)) })}
              disabled={disabled}
            />
            <span className="pf-stepper-unit">€/mes</span>
            <button
              data-testid="stepper-plus"
              type="button"
              className="pf-stepper-btn"
              onClick={() => set({ monthlyAmount: Math.min(5000, d.monthlyAmount + 50) })}
              disabled={disabled || d.monthlyAmount >= 5000}
            >+</button>
          </div>
        </div>

        {/* Radio group: frequency */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.frequency')}</label>
          <div className="pf-radio-group">
            {(['monthly', 'quarterly', 'yearly'] as const).map((v) => (
              <label key={v} className="pf-radio">
                <input
                  data-testid={`radio-frequency-${v}`}
                  type="radio"
                  name="frequency"
                  value={v}
                  checked={d.frequency === v}
                  onChange={() => set({ frequency: v })}
                  disabled={disabled}
                />
                {t(`products.contractForm.frequencies.${v}`)}
              </label>
            ))}
          </div>
        </div>

        {/* Text input: goal */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.goal')}</label>
          <input
            data-testid="field-goal"
            className="input"
            placeholder={t('products.contractForm.goalPlaceholder')}
            value={d.goal}
            onChange={(e) => set({ goal: e.target.value })}
            disabled={disabled}
          />
        </div>

        {/* Toggle: reinvest */}
        <label className="pf-toggle">
          <span className="input-label" style={{ marginBottom: 0 }}>{t('products.contractForm.reinvest')}</span>
          <div className="pf-toggle-track">
            <input
              data-testid="toggle-reinvest"
              type="checkbox"
              role="switch"
              checked={d.reinvest}
              onChange={(e) => set({ reinvest: e.target.checked })}
              disabled={disabled}
            />
            <div className="pf-toggle-thumb" />
          </div>
        </label>

        {/* Checkbox terms */}
        <label className="product-form-check">
          <input
            data-testid="checkbox-agreed"
            type="checkbox"
            checked={d.agreed}
            onChange={(e) => set({ agreed: e.target.checked })}
            disabled={disabled}
          />
          <span>{t('products.contractForm.terms')}</span>
        </label>
      </div>
    );
  }

  if (productId === 'seguro_vida' && form.id === 'seguro_vida') {
    const d = form.data;
    const set = (patch: Partial<SeguroVidaForm>) =>
      onChange({ id: 'seguro_vida', data: { ...d, ...patch } });
    const setExtras = (patch: Partial<SeguroVidaForm['extras']>) =>
      set({ extras: { ...d.extras, ...patch } });

    return (
      <div className="pf-fields">
        {/* Text input */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.holder')}</label>
          <input
            data-testid="field-holder"
            className="input"
            placeholder={t('products.contractForm.holderPlaceholder')}
            value={d.holder}
            onChange={(e) => set({ holder: e.target.value })}
            disabled={disabled}
          />
        </div>

        {/* Date picker: birth date */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.birthDate')}</label>
          <input
            data-testid="field-birth-date"
            className="input"
            type="date"
            value={d.birthDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => set({ birthDate: e.target.value })}
            disabled={disabled}
          />
        </div>

        {/* Select: coverage */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.coverage')}</label>
          <select
            data-testid="select-coverage"
            className="input"
            value={d.coverage}
            onChange={(e) => set({ coverage: e.target.value as SeguroVidaForm['coverage'] })}
            disabled={disabled}
          >
            <option value="50000">50.000 €</option>
            <option value="100000">100.000 €</option>
            <option value="150000">150.000 €</option>
          </select>
        </div>

        {/* Multi-checkbox: extras */}
        <div className="input-group">
          <label className="input-label">{t('products.contractForm.extras')}</label>
          <div className="pf-checkgroup">
            <label className="product-form-check">
              <input
                data-testid="extra-disability"
                type="checkbox"
                checked={d.extras.disability}
                onChange={(e) => setExtras({ disability: e.target.checked })}
                disabled={disabled}
              />
              <span>{t('products.contractForm.extraDisability')}</span>
            </label>
            <label className="product-form-check">
              <input
                data-testid="extra-critical"
                type="checkbox"
                checked={d.extras.critical}
                onChange={(e) => setExtras({ critical: e.target.checked })}
                disabled={disabled}
              />
              <span>{t('products.contractForm.extraCritical')}</span>
            </label>
            <label className="product-form-check">
              <input
                data-testid="extra-repatriation"
                type="checkbox"
                checked={d.extras.repatriation}
                onChange={(e) => setExtras({ repatriation: e.target.checked })}
                disabled={disabled}
              />
              <span>{t('products.contractForm.extraRepatriation')}</span>
            </label>
          </div>
        </div>

        {/* Toggle: smoker */}
        <label className="pf-toggle">
          <span className="input-label" style={{ marginBottom: 0 }}>{t('products.contractForm.smoker')}</span>
          <div className="pf-toggle-track">
            <input
              data-testid="toggle-smoker"
              type="checkbox"
              role="switch"
              checked={d.smoker}
              onChange={(e) => set({ smoker: e.target.checked })}
              disabled={disabled}
            />
            <div className="pf-toggle-thumb" />
          </div>
        </label>

        {/* Checkbox terms */}
        <label className="product-form-check">
          <input
            data-testid="checkbox-agreed"
            type="checkbox"
            checked={d.agreed}
            onChange={(e) => set({ agreed: e.target.checked })}
            disabled={disabled}
          />
          <span>{t('products.contractForm.terms')}</span>
        </label>
      </div>
    );
  }

  return <></>;
}

/* ── Icons ──────────────────────────────────────────────────────── */

const PRODUCT_ICONS: Record<ProductId, React.ReactNode> = {
  cuenta_corriente: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  tarjeta_credito: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  ),
  plan_ahorro: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 4-3 6-4 8H9c-1-2-4-4-4-8a7 7 0 0 1 7-7z" />
      <line x1="9" y1="21" x2="15" y2="21" />
      <line x1="10" y1="17" x2="14" y2="17" />
    </svg>
  ),
  seguro_vida: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};
