import Backbone from 'backbone'
import Mousetrap from 'mousetrap'
import Chess from 'chess.js'

import { FEN, ChessMove } from '../../../types'
import { dispatch, subscribe } from '../../../store'

// When you make a pawn move that requires pawn promotion,
// this is what shows up
//
export default class PiecePromotionModal extends Backbone.View<Backbone.Model> {
  private fen: FEN
  private moveIntent: ChessMove
  private readonly cjs = new Chess

  get el(): HTMLElement {
    return document.querySelector(`.piece-promotion-modal-container`)
  }

  events(): Backbone.EventsHash {
    return {
      'click .piece' : `_selectPiece`,
    }
  }

  initialize() {
    subscribe({
      'move:promotion': data => {
        this.fen = data.fen
        this.moveIntent = data.move
        this.show()
      }
    })
  }

  show() {
    this.el.style.display = `block`
    Mousetrap.bind(`esc`, () => this.hide())
  }

  hide() {
    this.el.style.display = `none`
    Mousetrap.unbind(`esc`)
  }

  _selectPiece(e, childElement) {
    const chosenPiece = childElement.dataset.piece
    const move: ChessMove = Object.assign({}, this.moveIntent, {
      promotion: chosenPiece
    })
    this.cjs.load(this.fen)
    const m = this.cjs.move(move)
    if (m) {
      dispatch(`move:try`, m)
    }
    this.hide()
  }
}
